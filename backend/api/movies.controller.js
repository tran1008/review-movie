// tập tin này là tập tin định tuyến dể truy cập vào tập tin dao, Controller
import MoviesDAO from "../dao/moviesDAO.js"
// Tạo class MoviesController
export default class MoviesController {
    // Tạo function apiGetMovies()
    static async apiGetMovies(req, res, next) {
        // Tiếp nhận yêu cầu từ máy khách thông qua api
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.queryPerPage) : 20 // =kiểm tra xem moviesPerPage có hay không nếu có thì chuyển từ dạng string về number còn ko thì lấy số 20
        const page = req.query.page ? parseInt(req.query.page) : 0
        let filters = {}
        if (req.query.rated) { // này là prams được truyền từ trên người dùng xuống
            filters.rated = req.query.rated  // kiểm tra xem trường rated và trường title có trong chuỗi query ko trong để thêm vào bộ lọc
        }
        else if (req.query.title) {
            filters.title = req.query.title
        }
        // Gọi tới hàm getMovies() đã định nghĩa trong daoMovie
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters, page, moviesPerPage
        })
        // Trả về chuỗi json để gửi về cho máy khác
        let response = {
            movies: moviesList,  // tham số này lấy ra được nhờ
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies
        }
        res.json(response)
    }
    static async apiGetMovieById(req, res, next) {
        try {
            let id = req.params.id || {};  // id ở đây do prams người dùng truyền vào
            let movie = await MoviesDAO.getMovieById(id);
            if (!movie) {
                res.status(404).json({ error: "not found" })
                return;
            }
            res.json(movie);
        }
        catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
    static async apiGetRatings(req,res,next){
        try {
            let propertyTypes=await MoviesDAO.getRatings();
            res.json(propertyTypes);
        } catch (e) {
            console.log(`api, {e}`);
            res.status(500).json({error:e});
        }
    }
}
