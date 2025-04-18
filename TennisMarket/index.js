/* index.js 역할
  모듈 모으기
  서버 시작
*/

let server = require('./server.js');
let router = require('./router.js');
let requestHandler = require('./requestHandler.js');
const mariadb = require('./database/connect/mariadb.js'); // 다양한 정보의 객체
mariadb.connect(); // 연결 시작

server.start(router.route, requestHandler.handler);