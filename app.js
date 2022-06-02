const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const UserRouter = require("./routes/user");
const PostRouter = require("./routes/post");
const CommentRouter = require("./routes/comment");

mongoose.connect("mongodb://localhost/hanghae99_week4HW", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use(express.json())
app.use("/api", UserRouter);
app.use("/api", PostRouter);
app.use("/api", CommentRouter);

app.get('/', (req, res) => {
    res.send("4주차 개인과제 항해99 7기 채예찬!!!");
});

app.listen(5000, () => {
    console.log("서버가 열렸습니다!!");
  });



  