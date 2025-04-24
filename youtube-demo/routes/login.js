// 로그인 '/login'

const express = require('express');
const router = express.Router();

const db_users = require('../db/db_users.js');

router.post('/', (req, res) => { 
  const {user_id, password} = req.body;

  // 빈 값 체크
  if(!user_id) {
    res.status(400).send("user_id 값으로 빈값은 들어올 수 없습니다.")
    return;
  }
  if(!password) {
    res.status(400).send("password 값으로 빈값은 들어올 수 없습니다.")
    return;
  }
  
  // user_id 있는지 체크
  if( !db_users.get(user_id) ){
    res.status(404).send("존재하지 않는 user_id 입니다.");
    return;
  }
  // 비밀번호 체크
  if( db_users.get(user_id).password !== password ){
    res.status(404).send("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 로그인 성공 => 응답
  res.status(201).json({
    success: true,
    user_id : user_id,
    message : `'${user_id}'님, 로그인에 성공하셨습니다.`
  });
})


module.exports = router;