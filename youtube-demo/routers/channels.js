// 채널 API
// app.js에서 app.use('/channel', channelsRouter) 로 넘겨받음

const express = require('express');
const router = express.Router();


let db_users = require('../db/db_users.js');
let db_channels = require('../db/db_channels.js');



// 채널 <생성>
router.post('/', (req,res) =>{
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
    title : title,
    videos : 0,
    subscribers : 0 
  }
  db_channels.set(url, data); // db_channels에 집어넣기
  db_users.get(user_id).channels[url] = data; // db_users에 집어넣기
  res.json({ // 응답
    success: true,
    message : "채널 생성에 성공하였습니다. 저장된 데이터는 아래와 같습니다.",
    ...data
  })
});



// 채널 <수정>
router.update('/', (req, res) => {
  
});


// 채널 <삭제>




module.exports = router;