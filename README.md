# 웹풀스택 과정 => 백엔드(node.js, express, mariadb) 프론트엔드(ts, 리액트), 배포

## node-base
```
node.js의 생태계 특성과 기본 사용법, npm사용법 등을 배운다
node.js와 http모듈을 이용하여 간단한 서버 오픈과 
HTTP 통신으로 데이터를 받고 응답하는 API를 구상해본다
```

## express-base
```
node-base 에서 순수 node.js와 http 모듈로 서버를 만들 수 있었지만

express 프레임워크에서 제공하는 기능으로 좀 더 간결하고 직관적으로
서버를 오픈하고, module.exports 를 이용하여 모듈화를 진행하고
express.Router()를 이용하여 라우터를 이용하여 API 분리 방법을 배운다.
```

## sql-practice-ticketing
```
데이터베이스 모델링 (테이블 구조 만들기, 테이블 간의 연관관계도 그리기)에 대해 배우고,
mariadb 데이터베이스 시스템을 이용하여 SQL문법으로 데이터를 다루는 방법을 배운다
```

## TeniisMarket
```
express를 이용하지않고, 순수node.js와 mariadb를 연동하여
db의 데이터를 CRUD(입력,조회,수정,삭제) 할 수 있는 쿼리 문을 배운다.
마지막으로 text형태로 html을 클라이언트에 응답하여 화면을 만들어본다. 
```

## youtube-demo
```
node.js, express 를 이용하여
로컬의 객체를 DB로 가정하고
유튜브demo 프로젝트를 만들어본다.
** 자료구조 Map 을 사용하여 DB데이터를 구성하다 **

DB
- 회원DB = new Map(id , {id, password, db, channels} )
                        객체라서 "key:value"형태
- 채널DB = new Map(url , {url, title, videos, subscribers} )

API
- 회원API => 회원가입, 회원개별조회, 회원개별수정, 회원개별삭제
- 채널 API => 생성, 조회, 수정, 삭제
(회원1명당 100개의 채널 생성가능)
```