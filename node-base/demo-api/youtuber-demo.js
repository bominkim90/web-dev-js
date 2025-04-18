const express = require('express'); // express 모듈 가져오기

const app = express(); // express 함수 실행해서 서버 다룰수있는 도구app 꺼내기

app.use(express.json());

app.get('/',(req,res) => {
  res.send("youtube 사이트에 오신걸 환영합니다!");
});

// 채널 주소 https://www.youtube.com/@LCK
// 채널 내 영상 주소 https://www.youtube.com/watch?v=MjUZKI9AC3M
// 영상 타임라인 주소 https://www.youtube.com/watch?v=i0qxKh4qNNk&t=762s


// db에 데이터 저장
let db_youtubers = new Map();
// new Map()은 undefined를 반환하지 않음
// console.log("db_youtubers : ",db_youtubers); 
db_youtubers.set("@sip", {
  채널명 : "@sip",
  닉네임 : "십오야",
  구독자수 : "593만명",
  영상수 : "993개",
  password : "비번1234"
});
db_youtubers.set("@chim", {
  채널명 : "@chim",
  닉네임 : "침착맨",
  구독자수 : "227만명",
  영상수 : "6.6천개",
  password : "비번1234"
});
db_youtubers.set("@teo", {
  채널명 : "@teo",
  닉네임 : "테오",
  구독자수 : "54.8만명",
  영상수 : "726개",
  password : "비번1234"
});
db_youtubers.set("@kim", {
  채널명 : "@kim",
  닉네임 : "보민짱채널임",
  구독자수 : 0,
  영상수 : 0,
  password : "비번1234"
});

let db_videos = new Map();
db_videos.set(1, {
  비디오url주소 : "www.youtube.com/video/1",
  생성일자 : "2025-03-01",
  총플레이타임: "1000s"
});
db_videos.set(2, {
  비디오url주소 : "www.youtube.com/video/2",
  생성일자 : "2025-04-02",
  총플레이타임: "9000s"
});
db_videos.set(3, {
  비디오url주소 : "www.youtube.com/video/3",
  생성일자 : "2025-05-03",
  총플레이타임: "8000s"
});


/* 이제 뭘 할거냐면? REST API 설계
  express의 params기능 + 자바스크립트 new Map()을 활용해서
  1) 유튜버 '전체' 조회 => (GET) url/youtubers
  2) 유튜버 '개별' 조회 => (GET) url/youtubers/@채널명
  3) 각 비디오 주소 조회 => (GET) url/watch?v=비디오명&s=현재재생시간
  4) 새 채널 "만들기" => (POST) url/youtubers
  5) 전체 채널 "삭제" => (DELETE) url/youtubers
  6) 개별 채널 "삭제" => (DELETE) url/youtubers/@채널명
  7) 개별 채널 "수정" = > (PUT) url/youtubers/@채널명
*/




// 1) 유튜버 전체 조회
app.get('/youtubers', (req,res) => {
  // new Map().forEach() 사용 ==> 일반배열의 forEach()와 다른 구조의 매개변수를 가짐
  let result;
  db_youtubers.forEach((value, key, map)=>{
    result[key] = value;
  });
  console.log(result);

  if(result) {
    console.log("있음");
    res.json(result);
  } else {
    console.log("없음");
    res.status(404).send("검색한 유튜버가 존재하지 않습니다.");
  }
});


// 2) 유튜버 개별 조회
app.get('/youtubers/:channel', (req, res, next)=>{
  let {channel} = req.params;
  
  let data = db_youtubers.get(channel);
  console.log("db_youtubers 데이터 : ", data);
  let result;
  let status;
  if( !data ){
    status = 404;
    result = {
      success : false,
      message : "채널이 존재하지 않습니다."
    }
  } else {
    status = 200;
    result = {
      success : true,
      data : data
    }
  }

  res.status(status).json(result);
});


// 3) 각 비디오 조회
app.get('/watch', (req, res)=>{ // url/watch?v=비디오넘버 -> 비디오 정보
  let {v} = req.query;
  v = parseInt(v); // params나 query스트링은 다 문자열로 들어온다

  let data = db_videos.get(v);
  let result;
  let status;
  if( !data ) {
    status = 404;
    result = {
      success: false,
      message : "데이터가 없습니다."
    }
  } else {
    status = 200;
    result = {
      success : true,
      data : data
    }
  }

  res.status(status).json(result);  
});



// 새로운 채널 만들기
app.post('/youtubers', (req,res) => {
  console.log(req.body.닉네임);
  if(!req.body.채널명){
    res.status(400).send("필수입력값인 채널명을 입력하지 않았습니다.");
    return;
  }
  if(!req.body.닉네임){
    res.status(400).send("필수입력값인 닉네임을 입력하지 않았습니다.");
    return;
  }
  let 채널명 = "@"+req.body.채널명;

  // 중복체크 (채널명)
  if(db_youtubers.get(채널명) !== undefined){
    res.status(400).send("채널명이 중복됩니다.");
    return;
  }

  // db에 집어넣기
  db_youtubers.set( 채널명,{
    채널명 : 채널명,
    닉네임 : req.body.닉네임,
    구독자수 : 0,
    영상수 : 0
  })

  console.log(db_youtubers);

  res.status(201).json(`채널명 : "${db_youtubers.get(채널명).채널명}", 
  닉네임임 : "${db_youtubers.get(채널명).닉네임}"으로 youtube채널이 만들어 졌어요`);
});


// 개별 채널 삭제
app.delete('/youtubers/:채널명', (req,res) => {
  let {채널명} = req.params;
  console.log(req.params);
  let {비밀번호} = req.body;

  // 채널이 존재하는지 체크
  if( db_youtubers.get(채널명) === undefined) { 
    res.status(404).json({
      message :"입력하신 '"+ 채널명 + "' 채널이 존재하지 않습니다."
    });
    return;
  }

  let result;
  // 비밀번호 체크
  if( db_youtubers.get(채널명).password === 비밀번호 ){
    db_youtubers.delete(채널명);
    result = {
      success : true,
      삭제된채널명 : 채널명,
      message : "삭제에 성공하였습니다."
    }
  } else {
    result = {
      success : false,
      message : "비밀번호가 틀려, 삭제에 실패하였습니다."
    }
  }

  console.log(db_youtubers);

  res.json(result);
});


// 전체 채널 삭제
app.delete('/youtubers', (req,res) => {
  let result;
  if(db_youtubers.size < 1) {
    result = {
      success : false,
      message : "현재 저장되어있는 채널이 없습니다."
    }
  } else {
    // db_youtubers.forEach( (value, key)=>{
    //   db_youtubers.delete(key);
    // });
    db_youtubers.clear(); // 전체 삭제
    console.log(db_youtubers);
    
    result = {
      success : true,
      message : "전체 채널 삭제 성공"
    }
  }

  res.json(result);
});


// 개별 채널 수정 (PUT) url/youtubers/@채널명
// req.body => {비밀번호 : 비밀번호, new닉네임 : "새로운닉네임"}
app.put('/youtubers/:채널명', (req,res) => {
  // @채널명의 채널이 존재하는지 확인
  let {채널명} = req.params;
  console.log(채널명);
  let {비밀번호} = req.body;
  let {new닉네임} = req.body;
 
  let result;
  if( db_youtubers.get(채널명) === undefined ) {
    result = {
      success : false,
      message : "존재하지 않는 채널입니다."
    }
  } else if(비밀번호 !== db_youtubers.get(채널명).password) {
    result = {
      success : false,
      message : "비밀번호가 틀립니다."
    }
  } else { // 수정 성공
    let new밸류 = {
      ...db_youtubers.get(채널명),
      닉네임 : new닉네임
    }
    db_youtubers.set(채널명, new밸류)
    result = {
      success : true,
      message : `새로운 닉네임 ${db_youtubers.get(채널명).닉네임}으로 수정에 성공하였습니다.`
    }
  }
  console.log(db_youtubers);

  res.json(result);
});





app.listen(1234, () => {
  console.log(`Example app listening on port ${1234}`);
});