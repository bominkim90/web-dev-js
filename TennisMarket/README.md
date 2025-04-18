# 프로젝트 목표
1. node.js에 db(mariadb) 연동 및 설정 파일 만들기
2. 서버 구동시키기
3. 화면(main.html)에 데이터 연동


## 세부 목표
1. node.js에서 각 js파일 모듈화 연습
2. 데이터베이스(mariadb)에 테이블 구조 짜는법 익히기
```
  mariadb 연결 후 추가한 기능
  1. 메인페이지(http://localhost:8888/)
    a링크 'order list' 를 누르면 -> '/orderlist' 로 넘어감
  넘어갈 때 -> (Tennis - orderlist테이블) "데이터 다 불러와서" 응답으로 화면에 넘겨줌
  2. order 버튼 클릭 시<input type="button" value="order" onclick="location.href='/order?productId=1'; ">
    '/order' url로 요청을 날리는데, queryData도 넘겨줌 ('/order?productId=1')
    function order() 에서 mariadb.query()를 이용해서 INSERT 해줌
    [Tennis > orderlist] INSERT orderlist VALUES( productId, new Date().toLocaleDateString() );
```

### 사용한 프로그램
1. vscode
2. Node.js
3. Docker : mariadb 설치 위해.
4. mariadb : Docker 이용해서 설치.
5. Git, GitHub


### 설치 필요한 외부 모듈
npm install mysql --save (mariadb 모듈)


### Tennis(DB) -> '테이블' 설계구조
CREATE TABLE product(
  id INT,
  name VARCHAR(30),
  decscription VARCHAR(100),
  price INT
);
CREATE TABLE orderlist(
  product_id INT,
  date VARCHAR(30)
);






#### 잡다한 정보
내 vscode 글꼴 : Cascadia Mono