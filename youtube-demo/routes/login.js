
const express = require('express');
const router = express.Router();

const connYoutube = require('../connYoutube.js');

// 로그인 '/login'
router.post('/', async (req, res) => { 
  const {user_email, user_pw} = req.body;
  
  if(!user_email || !user_pw) {
    res.status(400).send("로그인 정보로는 빈값이 들어올 수 없습니다.")
    return;
  }
  
  try {
    // email 먼저 체크
    const [emailRows, emailfields] = await connYoutube.promise().query(
      `SELECT email FROM users WHERE email = ?`, user_email
    )
    if( emailRows.length === 0 ){ 
      return res.status(404).send("해당 email 계정이 없습니다.");
    }
    // password 체크
    const [rows, pwfields] = await connYoutube.promise().query(
      `SELECT email, password FROM users WHERE email = ? AND password = ?`, 
      [user_email, user_pw]
    )
    if( rows.length === 0 ){ 
      return res.status(404).send("비밀번호를 올바르게 입력해주세요.");
    }

    res.status(201).json({
      message : `'${user_email}'님, 로그인에 성공하셨습니다.`
    });
  }
  
  catch (err) {
    console.log(err);
  }
})


module.exports = router;