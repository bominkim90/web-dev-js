
const express = require('express'); // express 모듈 가져오기
const app = express(); // express 함수 실행해서 도구 꺼내기
const port = 1234;

/* 미들웨어 */
// 요청으로 온 데이터(json형태일때) => 서버가 일을 수 있는 형식으로 파싱해줌
app.use(express.json());


// 홈
const homeRouter = require('./routers/home.js');
app.use('/', homeRouter);


// 회원 API (가입, 개별 조회, 개별 탈퇴)
const usersRouter = require('./routers/users.js');
app.use('/users', usersRouter);


// 로그인
const loginRouter = require('./routers/login.js');
app.use('/login', loginRouter);


// 채널 API (생성, 수정, 삭제)
const channelsRouter = require('./routers/channels.js');
app.use('/channels', channelsRouter);




// port 넘버로 => 서버 오픈
app.listen(port, () =>{
  console.log(`포트넘버(${port})로 서버가 오픈되었습니다.`)
});