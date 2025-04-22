
const express = require('express');
const router = express.Router();


router.post('/login', (req, res) => { // 로그인 => POST '/login'
  const {id, password} = req.body;

  // 빈 값 체크
  if(!id) {
    res.status(400).send("id 값으로 빈값은 들어올 수 없습니다.")
    return;
  }
  if(!password) {
    res.status(400).send("password 값으로 빈값은 들어올 수 없습니다.")
    return;
  }
  
  // id 있는지 체크
  if( !db_users.get(id) ){
    res.status(400).send("존재하지 않는 id 입니다.");
    return;
  }
  // 비밀번호 체크
  if( db_users.get(id).password !== password ){
    res.status(400).send("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 로그인 성공 => 응답
  res.status(201).json({
    success: true,
    id : id,
    message : `'${id}'님, 로그인에 성공하셨습니다.`
  });
})


module.exports = router;