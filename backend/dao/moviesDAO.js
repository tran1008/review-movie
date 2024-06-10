import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId 
let movies; // khởi tạo biến movies nơi để tham chiếu tới dữ liệu, MODEL

export default class MoviesDAO {
    // phương thức injectDB được chạy khi máy chủ khởi động và cung cấp nơi để tham chiếu tới dữ liệu
    static async injectDB(conn) { // truyền biến vào để tí gọi tới phương thức db sẽ truyền client vàoa
        if (movies) { // nếu dữ liệu đã được tham chiếu rồi thì ta không làm gì cả
            return;
        }
        try {
            movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection("movies")
        } catch (e) {
            console.error(`Unable to connect in moviesDAO: ${e}`);
        }
    }
    static async getMovies({ // phương thức getMovies chấp nhận tham số đầu tiên làm bộ lọc của nó
        filters = null, // bộ lọc mặc định là không có gì cả tiến hành truy xuất phim ở trang thứ 0 và 20 phim mỗi trang
        page = 0,
        moviesPerPage = 20 // will only get 20 movies at once
    } = {}) {
        //tiến hành lọc phim theo tiêu đề và rated 
        let query; //bộ lọc ban đầu sẽ rỗng người dùng sẽ tiến hành chỉ định bộ lọc
        if (filters) {
            if ("title" in filters) { // đầu tiên kiểm tra đối tượng xem có thuộc tính title hay không
                query = { $text: { $search: filters['title'] } }
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } } // kiểm tra phần xếp hạng xem có bằng nhau không
            }
        }
        let cursor;
        try {
            // ở đây phương thức này sử dụng skip thì sẽ áp dụng trước
            //dùng biến trung gian cursor bởi vì dữ liệu truy cập đôi khi rất lớn, cursor sẽ tìm để nạp dữ liệu theo lô để giảm tiêu thụ từ bố nhớ
            cursor = await movies.find(query).limit(moviesPerPage).skip(page * moviesPerPage); //truy xuất dữ liệu bỏ 20 pbim đầu
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);
            return { moviesList, totalNumMovies };
        } catch (e) {
            console.error(`Unable to find issue command: ${e}`)
            return { moviesList: [], totalNumMovies: 0 };
        }
    }
    static async getRatings(){
        let ratings=[];
        try {
           ratings=await movies.distinct("rated");
           return ratings;
        } catch (e) {
            console.error(`Unable to get Ratings, ${e}`);
            return ratings;
        }
    }
    static async getMovieById(id){
        try {
            return await movies.aggregate([
                { 
                    $match : { _id :new ObjectId(id)}, // dùng toán tử $ match ở đây để tìm document movie đúng với id
                },
                {          // collection to join  // field from input document              // output array filed          
                    $lookup : { from :'reviews', localField:'_id', foreignField:'movie_id', as: 'reviews'}
                }
                // toán tử $lookup giúp chúng ta tìm được tất cả các reviews cho movie mục tiêu và trả về thông tin movie cùng với các mảng review 
            ]).next();
        } catch (e) {
            console.error(`Something went wrong in getMovieById:${e}`);
            throw e;
        }
    }




    // static async getMovieById(id) {
    //     try {
    //         return await movies.aggregate([
    //             {
    //                 $match: { _id: new ObjectId(id), }
    //             },
    //             {
    //                 $lookup: { from: 'reviews', localField: '_id', foreignField: 'movie_id', as: 'reviews',}
    //             }
    //         ]).next();
    //     }
    //     catch (e) {
    //         console.error(`something went wrong in getMovieById: ${e}`);
    //         throw e;
    //     }
    // }
}