const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: [2, 'Comment should be at least 2 characters']
    },
    creator: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    recipe: {
        type: ObjectId,
        ref: "Recipe",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
