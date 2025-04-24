// 채널 API
// ** db_channels 수정시 => db_users도 같이 수정해야함

const express = require('express');
const router = express.Router();

// Map 형태 자료형
let db_users = require('../db/db_users.js');
let db_channels = require('../db/db_channels.js');


// 채널 <생성>
router.post('/', (req,res) => {
  const {user_id, url, title} = req.body;
  if( db_users.get(user_id) === undefined ) { // 1) id가 db_users에 존재해야함
    res.send(`${user_id} 는 존재하지 않는 회원user_id 입니다.`);
    return;
  }
  if( db_channels.get(url) !== undefined) { // 2) url 중복체크 (undefined아니면 기존url에 매칭되는 데이터가 있는거임)
    res.send(`${url} 은 중복이므로, 다른 url을 선택해주세요`);
    return;
  }
  if(Object.keys(db_users.get(user_id).channels).length >= 100) { // 3) 계정의 총 채널 개수 체크 (100개 미만이어야 함)
    res.send(`${user_id} 계정의 총 채널 개수가
      ${Object.keys(db_users.get(user_id).channels).length}개 이므로, 더이상 채널을 만들지 못합니다.`);
    return;
  }
  const data = { // 이제 DB에 데이터 집어넣기
    user_id : user_id,
    url : url,
    title : title
  }
  db_channels.set(url, data); // db_channels에 집어넣기
  db_users.get(user_id).channels[url] = data; // db_users에 집어넣기
  res.json({ // 응답
    success: true,
    message : "채널 생성에 성공하였습니다. 저장된 데이터는 아래와 같습니다.",
    ...data
  })
});


// 회원 채널 '전체' <조회>
/* 
  GET 요청이라 http 원칙상 body값을 보내지 않지만
  원래 회원id 정보는 http 헤더에 보내는건데, 그건 안배웠으니까
  여기선 req.body로 일시적으로 받는다 
*/
router.get('/', (req, res) => {
  const {user_id} = req.body;
  console.log(user_id);
  
  // 계정 정보 X
  if( !user_id || !db_users.get(user_id) ) {
    res.status(400).json({
      message : `${user_id} 계정은 존재하지 않는 계정입니다. 로그인이 필요한 페이지 입니다.`
    })
    return;
  }

  // 채널DB -> 계정id가 매칭되는 '모든' 정보
  let user_channels = Array.from(db_channels.values()).filter( value => {
    return value.user_id === user_id 
  })

  res.status(200).json({
    message : `${user_id} 계정에 대한, 전체 채널 정보입니다.`,
    data : user_channels
  })

});


// 회원 채널 '개별' <조회>
router.get('/:channel_url', (req, res) => { // 항상 parameter가 있어야하는 형태로만 정의됨
  const {user_id} = req.body; 
  
  // 계정 존재 X
  if( !user_id || !db_users.get(user_id) ) { 
    res.status(400).json({
      message : `${user_id} 계정은 존재하지 않는 계정입니다.  로그인이 필요한 페이지 입니다.`
    });
    return;
  }
  
  // 계정 존재 O
  console.log(`${user_id} 계정이 존재합니다`);

  const {channel_url} = req.params;
  let statusCode;
  let result;
  
  // 1) 전체 채널DB 에서 -> 계정id 매칭되는 값들
  let user_all_channels = Array.from(db_channels.values()).filter( value => {
    return value.user_id === user_id
  })

  // 2) url이 맞는걸 찾기
  let url_channel = user_all_channels.filter( value => value.url == channel_url );
  if(url_channel.length > 0) { // 채널url 매칭되는 정보 O
    statusCode = 400;
    result = {
      message : "채널URL에 매칭되는 채널 정보 입니다.",
      data : url_channel
    }
  } 
  else { // 채널url 매칭되는 정보 X
    statusCode = 400;
    result = {
      message : "계정은 존재하나, 채널url에 매칭되는 채널 정보가 존재하지 않습니다",
    }
  }
  
  res.status(statusCode).json(result);
});



// 채널 <수정> : title만 수정할 수 있음
// req.body에는 ==> 유저id, 채널url, 새로운채널title
router.put('/', (req, res) => {
  console.log(req.body);
  const {user_id, ch_url, new_title} = req.body;
  if(!user_id){
    res.status(400).send("user_id을 정확히 입력해주세요");
    return
  }
  if(!ch_url){
    res.status(400).send("ch_url을 정확히 입력해주세요");
    return
  }
  if(!new_title){
    res.status(400).send("new_title을 정확히 입력해주세요");
    return
  }
  db_channels.get(ch_url).title = new_title; // db_channels 수정하기
  db_users.get(user_id).channels[ch_url].title = new_title; // db_users 수정하기
  console.log(db_channels.get(ch_url).title);
  console.log(db_users.get(user_id).channels[ch_url].title);
  res.status(200).json({
    success : true,
    new_title : db_channels.get(ch_url).title,
  });
});


// 채널 <삭제>
// user_id와 채널url 받아야함
router.delete('/', (req,res) => {
  console.log(req.body);
  const {user_id, ch_url} = req.body;
  if(!user_id){
    res.status(400).send("user_id를 올바르게 입력해주세요");
    return;
  }
  if(!ch_url){
    res.status(400).send("ch_url를 올바르게 입력해주세요");
    return;
  }
  db_channels.delete(ch_url);
  delete db_users.get(user_id).channels[ch_url];
  console.log(db_channels.get(ch_url)); // undefined 나와야함
  res.status(200).json({
    success : true,
    message : `${ch_url} 채널 삭제 성공`
  })
});


module.exports = router;