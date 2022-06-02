const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    postId: Number,
    commentId: Number,
    name: String,
    comment: String
});

module.exports = mongoose.model("Comment", CommentSchema);