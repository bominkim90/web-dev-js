const express = require('express');

const app = express();


// 채널 주소 https://www.youtube.com/@LCK
// 채널 내 영상 주소 https://www.youtube.com/watch?v=MjUZKI9AC3M
// 영상 타임라인 주소 https://www.youtube.com/watch?v=i0qxKh4qNNk&t=762s

// 쿼리 스트링 받는법 => ?문자1=값&문자2=값2
app.get('/watch', (req, res) => { 
  const query = req.query;
  console.log(query.v);
  console.log(query.t);
 
  const data = {query : query}
  res.json(data);
});


// params 받는법 => 마지막 / 기호 뒤에 문자
app.get('/products/:num', (req, res) => {
  const params = req.params;
  let num = parseInt(params.num);
  res.json(num);
});


// 자바스크립트 "비구조화"
// => 이름이 어려울뿐이고, 그냥 객체나 배열에서 값을 바로 꺼내는 문법임
app.get('/page', (req, res) => { // /page?name=뻠&age=36
  const query = req.query;
  const {name, age} = query; // 이게 그냥 객체 비구조화 임..
  console.log("name : ", name);
  console.log("age : ", age);

  const data = {query : query}
  res.json(data);
});



app.listen(1234);