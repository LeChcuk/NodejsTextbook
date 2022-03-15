const mongoose = require('mongoose');

const { Schema } = mongoose;
const {
    Types: { ObjectId },
} = Schema;
const commentSchema = new Schema({
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// .model()메서드의 첫 번째 인수로 컬렉션 이름을 지정한다.
// 지정한 문자열을 소문자 + 복수형으로 변경하여 comments 컬렉션을 생성한다.
module.exports = mongoose.model('Comment', commentSchema);
