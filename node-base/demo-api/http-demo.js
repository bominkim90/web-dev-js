const http = require('http');

const server = http.createServer((req, res) => {
  // URL 따라 분기 처리 (라우팅 처리)
  if (req.url === '/') {
    res.write('Hello');
  } else if (req.url === '/test') {
    res.write('Test');
  }
  res.end(); // 응답 종료
});

server.listen(1234); // 특정 PORT 번호에 서버 오픈