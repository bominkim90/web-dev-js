
const express = require('express');
const router = express.Router();

// 모듈 불러오기 : require(mariadb.js) 코드가 읽히는 시점 => 안의 코드 한번 실행
// module.exports = 여기에담은값 (이게 require() 실행후 return 됨)

const conn = require('../mariadb.js'); // 현업에서 conn 줄임말로 많이 씀

conn.query(
  'SELECT * FROM `users`',

  function (err, results, fields) {
    console.log(results);
  }
);


let db_users = require('../db/db_users.js');



router.route('/')

  .post( (req, res) => { // 회원가입
    const {user_id, user_pw} = req.body;
    // 빈 값 체크
    if(!user_id) {
      res.status(400).send("user_id 값으로 빈값은 들어올 수 없습니다.")
      return;
    }
    if(!user_pw) {
      res.status(400).send("password 값으로 빈값은 들어올 수 없습니다.")
      return;
    }
    // user_id값 중복체크
    if( db_users.get(user_id) !== undefined ){
      res.status(400).send(`${user_id}값은 중복된 user_id입니다. 다른 user_id를 선택해주세요.`);
      return;
    }
    // db_users에 넣기
    db_users.set(user_id, {
      user_id : user_id,
      user_pw : user_pw
    })
    console.log(db_users);
    // 응답
    res.status(201).json({
      success: true,
      user_id : user_id,
      message : `'${db_users.get(user_id).user_id}'님 회원이 되신걸 축하드립니다.`
    });
  })

  .get( (req, res) => { // 회원 개별 조회
    const user_id = req.body.user_id;
    console.log(user_id);
    // 빈 값 체크
    if(!user_id) {
      res.status(400).send("id 값으로 빈값은 들어올 수 없습니다.")
      return;
    }
     // id 있는지 체크
     if( !db_users.get(user_id) ){
      res.status(400).send("존재하지 않는 user_id 입니다.");
      return;
    }
    // 조회 성공 => 응답
    res.status(201).json({
      success: true,
      user_id : user_id,
      message : `'${db_users.get(user_id).user_id}'님, 마이페이지 진입하셨습니다.`
    });
  })

  .delete( (req, res) => { // 회원 탈퇴
    const {user_id, user_pw} = req.body;
    // 빈 값 체크
    if(!user_id) {
      res.status(400).send("user_id 값으로 빈값은 들어올 수 없습니다.")
      return;
    }
    if(!user_pw) {
      res.status(400).send("user_pw 값으로 빈값은 들어올 수 없습니다.")
      return;
    }
    // user_id 있는지 체크
    if( !db_users.get(user_id) ){
      res.status(400).send("존재하지 않는 user_id 입니다.");
      return;
    }
    // 비밀번호 체크
    if( db_users.get(user_id).user_pw !== user_pw ){
      res.status(400).send("비밀번호가 일치하지 않습니다.");
      return;
    }
    // db_users에서 삭제
    db_users.delete(user_id);
    console.log(db_users);
    // 탈퇴 성공 => 응답
    res.status(201).json({
      success: true,
      user_id : user_id,
      message : `'${user_id}'님, 회원탈퇴에 성공하였습니다.`
    });
  });


module.exports = router;