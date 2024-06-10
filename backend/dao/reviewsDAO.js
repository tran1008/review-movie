import mongodb from "mongodb"
import mongoose from "mongoose"
const ObjectId = mongodb.ObjectId // tại sao ở đây chúng ta cần ObjectId là bởi vì chúng ta cần convert ObjectId để chuyển một chuỗi Id sang mongoDB ObjectID
let reviews; // khởi tạo biến nơi tham chiếu đến dữ liệu

export default class ReviewDAO {
    static async injectDB(conn) {
        if (reviews) {  // nếu có reviews rồi thì tiến hành return còn nếu chưa có thì tiên hành kết nối đến collection trong db
            return;
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews")
        } catch (e) {
            console.error(`Unable to entablish connection handle in reviewDAO: ${e}`)
        }
    }
    static async addReview(movieId, userInfo, review, date) {
        try {     // đây là những trường trong cái data access object mà người dùng muốn thêm vào trongcơ sở dữ liệu
            const reviewDoc = { // tạo đối tượng reviewDoc chứa các trường
                name: userInfo.name,
                user_id: userInfo._id,
                date: date,
                review: review,
                movie_id: new mongoose.Types.ObjectId(movieId)  // để truyển Object Id từ dạng String sang dạng Object Id trong mongodb Atlas
            }
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post Review: ${e}`)
            return { error: e };
        }
    }
    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateReponse = await reviews.updateOne(
                { user_id: userId, _id: new ObjectId(reviewId) },
                { $set: { review: review, date: date } })
            return updateReponse;
        } catch (e) {
            console.error(`Unable to update review ${e}`)
            return {error:e}
        }
    }
    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new mongoose.Types.ObjectId(reviewId),
                user_id: userId,
            });
            return deleteResponse;
        }
        catch (e) {
            console.error(`unable to delete review: ${e}`);
            return { error: e };
        }
    }
}