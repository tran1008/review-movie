// thực hiện việc kết nối tới cơ sở dữ liệu và chạy máy chủ web
import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from "./dao/moviesDAO.js"
import ReviewDAO from "./dao/reviewsDAO.js"
async function main(){ //  hàm main là hàm bất động bộ dùng asyns để chờ kết nối tới cơ sở dữ liệu trên mongodb alats
    dotenv.config() // tải dữ liệu về các biến môi trường
    const client=new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI); 
    const port=process.env.PORT || 8000  //tạo cổng thông tin để truy cập nếu ko dc sẽ lấy port 8000
    try {
    await client.connect();  // chờ để kết nối tới dữ liệu
    await MoviesDAO.injectDB(client);  // gọi hàm injectDB để tham chiếu tới dữ liệu trong cơ sở dữ liệu
    await ReviewDAO.injectDB(client);
    app.listen(port, ()=>{  // sau khi kết nối tới db mà không lỗi server sẽ in ra câu lệnh dưới đây
        console.log("Server is running on port + ", port);
    })

    } catch (e) {
        console.error(e);  // tiến hành bắt lại những lỗi nếu có lỗi đang xảy ra trên màn hình console
        process.exit(1);
    }
}
main().catch(console.error); // để thông báo có bất kì lỗi nào xảy ra khi chạy máy chủ trên màn hình console