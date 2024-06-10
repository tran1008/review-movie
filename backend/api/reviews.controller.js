import ReviewsDAO from '../dao/reviewsDAO.js'
// tập tin controller giúp nhận yêu cầu từ máy khách với các phương thức kết nối đến phương thức trong tập tin dao để thực hiện việc truy xuất dữ liệu cũng như thêm sửa xóa dữ liệu
export default class ReviewsController{
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id; // lấy các trường tương ứng trong file json truyền bằng postman lên
            const review = req.body.review;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };
            const date = new Date();
            const ReviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const review = req.body.review;
            const date = new Date();
            const ReviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id, // muốn update user_id thì phải là user_id đã tạo ra review
                review,
                date
            );
            var { error } = ReviewResponse;
            if (error) {
                res.status.json({ error });
            }
            if (ReviewResponse.modifiedCount === 0) {  // thuộc tính modifiedCount để xác định xem movies đã có thực sự được sửa hay chưa
                throw new Error("unable to update review. User may not be original poster");
            }
            res.json({ status: "success " });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async apiDeleteReview(req,res,next){
        try {
            const reviewId=req.body.review_id;
            const userId=req.body.user_id;
            const reviewReponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            )
            res.json({status:"success"})
        } catch (error) {
            res.status(500).json({error:e.message});
        }
    }
}