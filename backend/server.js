import express from "express"  // import các thư viện cần thiết
import cors from "cors"
import movies from "./api/movies.route.js"
const app=express(); // tạo server web với câu lệnh app=express()
app.use(cors()); 
app.use(express.json());  // sử dụng middleware như là một phần mềm trung gian giúp nhận yêu cầu từ máy khách trước khi có phản hồi từ máy chủ
// định tuyến tới api/v1/movies
app.use("/api/v1/movies",movies);
// định tuyến tới những router bị lỗi
app.use("*", (req,res)=>{
    res.status(404).json({error:"not found"})  
})
export default app;  // export app dưới dạng module việc này nhằm chia nhỏ xử lý ở server theo nhiều module, ví dụ tách mã nguồn cơ sở dữ liệu sang một module khac
