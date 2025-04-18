// import express from 'express' // ES 모듈 문법 (사용하려면 package.json에 "type": "module" 필요)
const express = require('express'); // CommonJS 문법(기본제공)으로 'express' 모듈 불러오기

const app = express(); // express 함수를 실행해서
// 서버를 조작할 수 있는 기능이 들어 있는 객체"를 만들어서 return (그것이 app에 담김)


// API : GET 요청 + "/" 경로 → 브라우저에서 http://localhost:1234/ 로 접속하면 이 코드 실행
app.get('/', (req, res) => {
  res.send('Hello World');
});


app.get('/products/1', (req,res)=>{
  let product = {
    name : "상품 1",
    price : 20000
  }

  // res.send(product); // 가능O (내부에서 알아서 json으로 변환해줌)
  res.json(product);
});


app.listen(1234); // 서버를 포트 1234에서 실행. 브라우저에서 http://localhost:1234 접속 가능
