const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware");

  //회원가입
  const postUsersSchema = Joi.object({ 
    username: Joi.string().alphanum().min(3).max(30).required(), 
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(), 
    confirmpassword: Joi.string().required(), 
  })

  router.post("/register", async (req, res) => {
  try {
    const { username, password, confirmpassword,} = await postUsersSchema.validateAsync(req.body);
  
    if (password !== confirmpassword) {
      res.status(400).send({
        errorMessage: "비밀번호가 일치하지 않습니다.",
      });
      return;
    } else if (username === password) {
      res.status(400).send({
        errorMessage: "아이디와 비밀번호를 다르게 해주세요.",
      });
    } 
  
    const existUsers = await User.find({ username });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }
  
    const user = new User({ username, password,});
    await user.save();
  
    res.status(201).send("회원가입에 성공하셨습니다.");
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }  
  });
  //로그인
  const postLoginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(), 
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(), 
  });

  router.post("/login", async (req, res) => {
  try {
    const { username, password } = await postLoginSchema.validateAsync(req.body);
  
    const user = await User.findOne({ username, password }).exec();
    console.log(user);
    if (!user) {
      res.status(400).send({
        errorMessage: "아이디 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }
    
    const token = jwt.sign({ userId: user.userId }, "myK-secret-key",);
    res.send({
      token,
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }   
  }); 

  router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    console.log(user)
    res.send({
      user : {
        username: user.username
      },
    });
  });

  module.exports = router;