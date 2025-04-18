const express = require('express');
const app = express(); 
const port = 1234;





let arr = [
  {id : 1, name : 'apple'},
  {id : 2, name : 'orange'},
  {id : 3, name : 'strawberry'},
  {id : 4, name : 'blueberry'}
]


// 과일 '전체' 조회
app.get('/fruits', (req, res) => {
  let result = arr.map( item => item.name ); // map() 새로운 배열 반환
  console.log(result);

  res.json(result);
});


// 과일 '개별' 조회
app.get('/fruits/:id', (req, res) => {
  let {id} = req.params;
  id = parseInt(id);
  console.log(id);

  let result = arr.find( item => item.id === id ); // return true; 일때의 '첫'번째값 반환 
  console.log(result);

  // HTTP status code => 클라이언트와 소통을 정확하게 하기 위함
  if(result) {
    // 200 성공 ( 여기 res.json() 내부에서 알아서 200 처리됨 )
    res.json( {success : true, data : result} )
  } else {
    // 404 없는 페이지임
    res.status(404).json( {success : false, message : "해당 과일은 존재하지 않습니다."} )
  }
});









app.listen(port, () => {
  console.log(`해당 포트번호(${port})로 서버가 오픈되었습니다.`)
});