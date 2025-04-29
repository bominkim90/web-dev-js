
const express = require('express');
const app = express(); 
const port = 1234;

/* 미들웨어 */
// 요청으로 온 데이터(req.body)가 JSON형식 일 때 => 서버가 읽을 수 있는 형식으로 파싱해줌
app.use(express.json());


// 홈
const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);


// 회원 API (가입, 개별 조회, 개별 탈퇴)
const usersRouter = require('./routes/users.js');
app.use('/users', usersRouter);


// 로그인
const loginRouter = require('./routes/login.js');
app.use('/login', loginRouter);


// 채널 API (생성, 수정, 삭제)
const channelsRouter = require('./routes/channels.js');
app.use('/channels', channelsRouter);




app.listen(port, () =>{
  console.log(`포트넘버(${port})로 서버가 오픈되었습니다.`)
});
