const express = require('express');
const app = express();

let db = new Map(); // db.set(키, 벨류); 
// new Object()와는 다르게 -> 키값에 문자,숫자,객체,함수 다 들어갈 수 있다
db.set(1, {name : "NoteBook", price : 5000});
db.set(2, {name : "Cup", price : 10000});
db.set(3, "Chair");
console.log("db", db);

app.get('/products/:num', (req, res)=>{ // 제품 페이지
  let {num} = req.params;
  num = parseInt(num);
  console.log("num : ",num);

  let data;
  console.log("db.get(num) : ",db.get(num));
  if( !db.get(num) ) {
   data = {message : "존재하지 않는 제품입니다."}
  } else {
    data = {
      id : num,
      ...db.get(parseInt(num))
    }
    
    // data.id = num; // 위와 같은 의미임
    // data[id] = num;
  }
  console.log(data);
  res.json(data);
});


app.listen(1234);