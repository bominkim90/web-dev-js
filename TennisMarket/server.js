/* server.js 역할
  서버 구동 함수
*/


let http = module.require('http'); // http 모듈


function start(route, handler){

  function onRequest(request, response){
    route(request, response, handler);
  }

  http.createServer( onRequest ).listen(8888);
  // localhost:8888
}


// module.exports = {start : start};
exports.start = start;