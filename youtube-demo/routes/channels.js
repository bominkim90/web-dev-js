const express = require('express');
const router = express.Router();

const connYoutube = require('../connYoutube.js'); // connYoutube.js 모듈 불러오기


let db_users = require('../db/db_users.js');
let db_channels = require('../db/db_channels.js');

// 채널 <생성>
router.post('/', (req,res) => {
  const {user_id, ch_url, ch_title} = req.body;
  if( db_users.get(user_id) === undefined )
  { 
    res.send(`${user_id} 는 존재하지 않는 회원user_id 입니다.`);
    return;
  }
  if( db_channels.get(ch_url) !== undefined)
  { 
    res.send(`${ch_url} 은 중복이므로, 다른 ch_url을 선택해주세요`);
    return;
  }
  // db_channels에서 '김보민'회원이 가진 모든 채널 조회
  const allChannelsOfUser = Array.from(db_channels.values()).filter( value => {
    return value.user_id == user_id
  })
  if(allChannelsOfUser.length >= 100)
  { 
    res.send(`${user_id} 계정의 총 채널 개수가 ${allChannelsOfUser.length}개 이므로, 더이상 채널을 만들지 못합니다.`);
    return;
  }
  const data = { 
    user_id : user_id,
    ch_url : ch_url,
    ch_title : ch_title
  }
  db_channels.set(ch_url, data);
  res.json({
    success: true,
    message : "채널 생성에 성공하였습니다. 저장된 데이터는 아래와 같습니다.",
    ...data
  })
});


// 회원 채널 '전체' <조회>
router.get('/', (req, res) => {
  const {user_id} = req.body;
  console.log(user_id);
  
  if( !user_id || !db_users.get(user_id) ) {
    res.status(400).json({
      message : `${user_id} 계정은 존재하지 않는 계정입니다. 로그인이 필요한 페이지 입니다.`
    })
    return;
  }
  
  let allUserChannels = Array.from(db_channels.values()).filter( value => {
    return value.user_id === user_id 
  })
  res.status(200).json({
    message : `${user_id} 계정에 대한, 전체 채널 정보입니다.`,
    data : allUserChannels
  })
});


// 회원 채널 '개별' <조회>
// .get('/:ch_url',콜백함수) -> /:params 이렇게쓰면 --> 항상 parameter가 있어야하는 형태로만 받아야함
router.get('/:ch_url', (req, res) => 
{
  if( !req.body ) {
    return res.status(400).json({message : `GET요청이지만 body값 포함해서 날려주세요`});
  }

  const user_id = req.body.user_id; 
  if( !user_id ) {
    return res.status(400).json({message : `로그인이 필요한 페이지 입니다.`});
  }

  if( !db_users.get(user_id) ) { 
    return res.status(400).json( {message : `${user_id} 계정은 존재하지 않는 계정입니다.`} );
  }
  
  const ch_url = req.params.ch_url;
  let statusCode, result;
  
  let allUserChannels = Array.from(db_channels.values()).filter( value => {
    return value.user_id === user_id
  })
  
  let channelUrlData = allUserChannels.filter( value => value.ch_url == ch_url );
  if(channelUrlData.length > 0) { // 채널url 매칭되는 정보 O
    statusCode = 400;
    result = {
      message : "채널URL에 매칭되는 채널 정보 입니다.",
      data : channelUrlData
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

  db_channels.get(ch_url).ch_title = new_title; // db_channels 수정하기
  res.status(200).json({
    success : true,
    new_title : db_channels.get(ch_url).ch_title,
  });
});

// 채널 <삭제>
router.delete('/', (req,res) => {
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
  res.status(200).json({
    success : true,
    message : `${ch_url} 채널 삭제 성공`
  })
});

module.exports = router;