const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 요청이 들어올 때마다 -> JSON 형식으로 전달된 데이터를 js객체로 변환해줌(파싱)
app.use(express.json());


app.post('/test', (req,res) => {
  // body에 숨겨져서 들어온 데이터를 화면에 뿌려줘볼까?
  console.log(req.body);
  let {message} = req.body;
  
  res.send(`응답 : "${message}" 잘 받았다`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})