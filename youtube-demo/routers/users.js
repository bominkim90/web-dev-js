
const express = require('express');
const router = express.Router();



let db_users = require('../db/db_users.js');



router.route('/:id')
  .post( (req, res) => { // 회원가입
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
    
    // id값 중복체크
    if( db_users.get(id) !== undefined ){
      res.status(400).send(`${id}값은 중복된 id입니다. 다른 id를 선택해주세요.`);
      return;
    }

    // db_users에 넣기
    db_users.set(id, {
      id : id,
      password : password
    })
    console.log(db_users);

    // 응답
    res.status(201).json({
      success: true,
      id : id,
      message : `'${db_users.get(id).id}'님 회원이 되신걸 축하드립니다.`
    });
  })


  .get( (req, res) => { // 회원 개별 조회
    const {id} = req.params;
    console.log(id);

    // 빈 값 체크
    if(!id) {
      res.status(400).send("id 값으로 빈값은 들어올 수 없습니다.")
      return;
    }
  
     // id 있는지 체크
     if( !db_users.get(id) ){
      res.status(400).send("존재하지 않는 id 입니다.");
      return;
    }
  
    // 조회 성공 => 응답
    res.status(201).json({
      success: true,
      id : id,
      message : `'${db_users.get(id).id}'님, 마이페이지 진입하셨습니다.`
    });
  })

  .delete( (req, res) => { // 회원 탈퇴
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
  
    // db_users에서 삭제
    db_users.delete(id);
    console.log(db_users);
  
    // 탈퇴 성공 => 응답
    res.status(201).json({
      success: true,
      id : id,
      message : `'${id}'님, 회원탈퇴에 성공하였습니다.`
    });
  });


router.post('/login', (req, res) => { // 로그인 => POST '/users/login'
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