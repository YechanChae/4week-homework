const express = require("express");
const Comments = require("../schemas/comment");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//댓글 생성(로그인시 가능)
router.post('/posts/:postId/comment', authMiddleware, async (req, res) => {
    const { comment, commentId, } = req.body;
    const { postId } = req.params;
    const { username } = res.locals.user;
    // console.log(comment, commentId,postId, username);

    if (!comment) {
        res.status(400).send({
            errorMessage: "댓글 내용을 입력해주세요",
        });
        return;
    }

    const createComments = await Comments.create({ comment, commentId, postId, name: username })
    res.json({ createComments });
});

//댓글 목록조회

router.get('/posts/:postId/comment', async (req, res) => {
    const { postId } = req.params;

    const comments = await Comments.find({ postId }).sort("-commentId");
    // console.log(comments)
    res.json({ comments })
});

//댓글 수정

router.patch('/posts/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { username } = res.locals.user;
    const { comment, name } = req.body;
    // console.log( commentId, name, comment, username)

    if (name === username) {
        await Comments.updateOne({ commentId: Number(commentId) }, { $set: { comment: comment } });
        res.send({ comment: comment });
    } else {
        res.send({ result: "fail" });
    }

});

//댓글 삭제

router.delete('/posts/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { username } = res.locals.user;
    const { name } = req.body;
    // console.log( commentId, name, comment, username)

    if (name === username) {
        await Comments.deleteOne({ commentId: commentId })
        res.send({ result: "success" });
    } else {
        res.send({ result: "fail" });
    }
});

module.exports = router;