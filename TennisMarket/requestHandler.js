/* requestHandler.js
  requestHandler.js는 요청 처리와 DB 조회를 담당
  router.js에서 URL에 따라 "무엇"을 실행할지 결정했을때 -> 그 "무엇"의 함수들을 정의
*/

const mariadb = require('./database/connect/mariadb.js'); // node.js 와 mariadb 연결하기 위한 프로그램(모듈)
const fs = require('fs'); // 파일 읽기 위한 모듈

function main(response){
  
  // mariadb 연결창구에서 query라는 함수가 있다 => SQL문을 작성할 수 있고,
  // 데이터 불러온 후 동작하는 콜백함수 넣을수 있다.
  mariadb.query("SELECT * FROM product", function(err, rows){
    // console.log(rows);
    fs.readFile('./main.html', 'utf8', function(err, data) {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.write('파일을 읽는 도중 에러가 발생했습니다.');
        response.end();
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.write(data); // main.html 파일의 내용을 그대로 클라이언트에 전송
        response.end();
      }
    });

  });
}


function error(response){
  response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
  response.write('없는 page 입니다~');
  response.end();
}

function redRacket(response){
  fs.readFile('./img/redRacket.png', function(err,data){
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write(data);
    response.end();
  })
}
function blueRacket(response){
  fs.readFile('./img/blueRacket.png', function(err,data){
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write(data);
    response.end();
  })
}
function blackRacket(response){
  fs.readFile('./img/blackRacket.png', function(err,data){
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write(data);
    response.end();
  })
}

function order(response, queryData){ // Tennis Market 화면에서 'order'버튼 누를시 -> DB업데이트
  let productId = queryData.productId;
  console.log("productId : ",productId);
  mariadb.query(`INSERT INTO orderlist VALUES(
      ${productId}, 
      '${new Date().toLocaleDateString()}'
    );` 
    , function(err, rows){
      // console.log("rows: ",rows);

      // '/orderlist' 로 화면 넘겨주기
      response.writeHead(302, {
        Location: '/orderlist'
      });
      response.end();
    });
}

function orderlist(response){
  mariadb.query(`SELECT * FROM orderlist;`
    , function(err, rows){
      console.log("rows: ",rows);
      let html = `
        <!DOCTYPE>
        <html lang="ko">
          <head>
            <meta charset="UTF-8">
            <title>Order List</title>
            <style>
              * {padding: 0; margin: 0; box-sizing: border-box;}
              h1 {text-align: center;}
              .text-center {text-align: center; margin: 20px 0;}
              table {margin: 0 auto; text-align: center;}
            </style>
          </head>
          <body>
            <h1>Order List 페이지</h1>
            <div class="text-center">
              <a href="/">go home</a>
            </div>
            <table style="border: 1px solid #000;">
              <tr> <!-- 열 제목 -->
                ${ Object.keys(rows[0]).map(item=> ('<th>'+ item +'</th>')).join('') }
              </tr>
              ${ rows.map(oneData=> (`<tr> 
                  ${Object.keys(oneData).map( key=>('<td>'+oneData[key]+'</td>') ).join('') } 
                </tr>`)).join('') }
              
            </table>
          </body>
        </html>
      `;
      // rows.map(oneData=> ('<tr>'+   Object.keys(oneData).map(key=>('<td>'+oneData[key]+'</td>'))  +'</tr>')).join('')
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.write(html);
      response.end();
    });
}



let handler = {
  '/' : main,
  '/error' : error,
  '/order' : order,
  '/orderlist' : orderlist,

  
  '/img/redRacket.png' : redRacket,
  '/img/blueRacket.png' : blueRacket,
  '/img/blackRacket.png' : blackRacket
};

/* image directory */

exports.handler = handler;