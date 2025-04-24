
# 유튜브 회원 가입 -> 로그인 -> 채널만들기

``` 
* 유튜브 미니 프로젝트 에서 생각해야 할 것 *
(node.js + express 이용)

1. REST API 설계 방법 (HTTP method, url)
  - GET, POST, DELETE 요청 처리하기
  - app.route(path) .get() . post() .delete();
    이렇게 app.route(path)를 이용하여 메서드 채이닝을 써서 간단하게 표현하기

2. 예외 처리 (if문, status code)
  - 상황에 따라 결과를 다르게 행하고,
    마지막 응답을 보낼때 status code도 같이 보내기

3. 라우터 처리 (url을 기준으로 => API 파일 분리)
  - exrpess의 router, use() 기능을 이용하여
    path기준으로 구분되는 API를 파일로 분류한다.
    이유는, 코드를 파일 단위로 분리함으로써 한눈에 알아보기 쉽게 할 수 있고,
    그 라우터파일이 특정 API의 코드묶음이구나 구분하게 해준다.

4. 각 API path 주소
  회원가입
    POST '/users' 
    req.body로 받는거 - id,password, name

  로그인
    POST '/users/login' 
    req.body로 받는거 - id,password

  개별 회원 조회
    GET '/users/:id' 
    req.body로 받는거 - id

  개별 회원 탈퇴
    DELETE '/users' 
    req.body로 받는거 - id,password


5. express 도구들 기능
  - app.route(path)
    // app.route(path)는 app.get(path)랑 다를게 없음
    // 그냥 원래는 app.get(), app.post() 따로 만들어야하는걸 app.route() 뒤에 채이닝으로 붙여서 깔끔하게 보이게 해주는 기능일 뿐
    // 대신 신경써야할게 -> app.get(path)도 '/' 이렇게하면'/'이거 하나만을 위한 처리이듯이('/:id'와 다르듯이) route(path)도 신경써야함  

```


---


## *회원* API
```
1) 회원 <가입> (POST '/users')
  - req : body(id, password, name)

    체크 사항 
    -> id, password 빈값 체크
    -> 기존 회원DB의 id와 새로 가입하는 id 값 중복체크
    -> 회원DB의 고유id는 회원id와 같은걸 씀

  - res : id 회원가입 성공

2) <로그인> (POST '/login')
  - req : body (id, password)
    
    체크사항
    -> id, password 빈값 체크
    -> id가 회원DB에 존재하는지 체크
    -> password가 회원DB.get(id).password랑 같은지 체크
    
  - res : id 로그인 성공

3) 회원'개별' <조회> (GET '/users')
  - req : body (id) => JWT배우면 header로 받음
   
    체크사항
    -> id값 빈값 체크
    -> id가 회원DB에 존재하는지 체크

  - res : id 마이페이지임

4) 회원'개별' <탈퇴> (DELETE '/users')
  - req : body(id, password)

    체크사항
    -> 로그인과 동일하게
    -> id, password 빈값 체크
    -> id가 회원DB에 존재하는지 체크
    -> password가 회원DB.get(id).password랑 같은지 체크

  - res : ${name}다음에 또 뵙겠삼요
```



---



## *채널* API (회원에 종속)
*** 회원은 계정 1개당 채널 100개 까지 가질 수 있다. ***
```
  1) 채널 <생성>
    - method, path => POST, '/channel'
    - req.body => {
        id : "",
        url : "", // "bomin_ch" 이렇게 /빼고 받기
        title : ""
      }

    - 체크사항 
      1. id가 db에 존재하는 id여야함
      2. 채널url 중복체크
        채널DB.get(new_ch_url) === undefined 나와야함 (그래야 그 url 없는거) 
      3. 계정(id)의 총 채널개수가 100개 인지 체크
        Object.keys(회원DB.get(id).channels).length < 100 이면 성공시키기

    - 이제 데이터 집어넣기 
      2개의 DB(db_users, db_channels)에 동시 저장
      {
        user_id : id,
        url : url,
        title : title,
        videos : 0,
        subscribers : 0 
      }
      db_channels.set(url, data); // db_channels에 집어넣기
      db_users.get(id).channels[url] = data; // db_users에 집어넣기


  2) 채널 <수정>
    - method, path => UPDATE, '/channel'
    - req.body => {
        user_id : "", 
        ch_url : "", 
        ch_title : ""
      }

    - 체크사항
      -> 기존title과 바꾸려는 title이 같은지 체크
      -> id의 총 채널개수가 100개 인지 체크

    - 이제 데이터 덮어쓰기
      2개의 DB(db_users, db_channels)에 동시 저장
  3) 채널 <삭제>
```
