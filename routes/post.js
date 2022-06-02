const express = require("express");
const Posts = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

//게시글 생성(로그인시 가능)
router.post('/posts', authMiddleware, async (req, res) => {
    const { postId, username, date, title, content } = req.body;

    const posts = await Posts.find({ postId });

    const createdPosts = await Posts.create({ postId, username, date, title, content });
    res.json({ posts: createdPosts });

});
//게시글 상세조회
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params;

    const [detail] = await Posts.find({ postId: Number(postId) })

    res.json({
        detail,
    });
});

//게시글 전체조회
router.get('/posts', async (req, res) => {
    const { postId, username, date, title, content } = req.body;

    const posts = await Posts.find({}, { postId: 1, username: 1, date: 1, title: 1, content: 1 });
    res.json({
        posts,
    });

});
module.exports = router;
