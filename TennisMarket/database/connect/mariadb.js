const mariadb = require('mysql'); // mysql 모듈 불러오기

// 연결 통로 만들어주기 => node.js에서 mariadb 접속
const conn = mariadb.createConnection(
  {
    host: 'localhost',
    port: 3306, // Docker에서 mariadb 설치할때 적음
    user: 'root',
    password: 'root',
    database: 'Tennis'
  }
);

module.exports = conn;