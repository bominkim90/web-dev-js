/* router.js
  클라이언트(브라우저)요청의 URL에 따라 -> 뭘 실행할지 결정
*/


let url = require('url'); // url 모듈


function route(request, response, handler){
  let pathname = url.parse(request.url).pathname;
  let queryData = url.parse(request.url, true).query; // url?쿼리데이터 
  if(pathname == '/favicon.ico') return;
  
  console.log("pathname : ",pathname);
  if( typeof handler[pathname] !== 'function'){
    handler['/error'](response);
    return;
  }

  handler[pathname](response, queryData);
}


exports.route = route;