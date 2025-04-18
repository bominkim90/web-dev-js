# 데이터베이스 모델링 연습

## 프로젝트 개요

### 훈련 목표
  - 데이터베이스 관계 다이어그램(ERD)를 생성하고,
  이를 바탕으로 데이터베이스를 직접 설계하여 간단한 쿼리를 작성합니다.

### [데이터 요구 사항] 분석 및 모델링
- 간단한 웹 서비스의 데이터 요구 사항을 분석하고, 이를 기반으로 ERD를 작성합니다.
- 연관이 있는 테이블은 실선으로 이어줍니다. (옵션: 화살표)

### 설계 및 구현
- ERD를 바탕으로 직접 데이터베이스 테이블(스키마)을 설계하고,
 DDL을 사용하여 데이터베이스에 구현합니다.
- 각 테이블에 데이터를 입력, 수정, 조회할 수 있는 SQL문 작성합니다.

### 프로젝트 요구 사항 (제한 사항)
- 모든 공연은 공연 1개당 회원 1명이 구매 가능한 수량 제한은 100장입니다.
- 각 공연의 회차는 1회입니다.
  (같은 이름의 공연은 1개만 존재)
- 모든 공연의 좌석 예매는 할 수 없습니다.
- 데이터베이스 다이어그램을 그릴 수 있는 ERD 툴 사용은 선택입니다.
 (기본 툴은 PPT로 그리셔도 됩니다.)
 툴 : dbdiagram



---

## 필요 TABLE
1. "공연" 정보 
- 타이틀, 시간, 가격, 이미지, 설명글
```
CREATE TABLE shows (
  id INT AUTO_INCREMENT PRIMARY KEY, // 고유값
  title VARCHAR(100) NOT NULL,
  datetime DATETIME NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255),
  description VARCHAR(1000)
);
```

2. "회원" 정보 
- 이메일, 비밀번호, 이름
```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  name VARCHAR(100),
  password VARCHAR(100)
);
```

3. 예매(주문) 현황
- 예매날짜, 수량, 회원email, 회원name,공연title,총price
```
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  datetime DATETIME,
  quantity INT,
  total_price INT,

  -- 먼저 만들어둬야 외래키 설정 가능
  user_id INT,
  show_id INT,

  -- 외래키로 연결 (이건 그냥 설정 : 테이블에 표시X)
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (show_id) REFERENCES shows(id)
);
```

---

## "제한 사항"에 필요한 로직
- 한 공연당 한사람의 최대 예매 제한수는 100장
	1. 예매 완료 처리전, {주문자의 user_email과 공연의 show_title} 을 기준점으로
  	orders 테이블과 기준점이 곂치는 데이터(match)들을 불러온다.
	2. 그 match데이터들이 가지고있는 quantity(예매수량)을 총합하여
	3. “현재 구매하려는 수량 + 기존 총합” 이 100을 넘냐를 검사하여
	4. 넘지 않으면 예매OK / 넘으면 예매X

- orders테이블에서 외래키로 연결한 데이터에서 특정 데이터 JOIN해서 불러오기
  1. user_id -> users.name, users.email
  2. show_id -> shows.title, shows.price



### 참고
외래키 user_id를 이용해서 users.email이랑 users.name 가져오는 방법
SQL 쿼리 예시 (JOIN 사용)
```sql
SELECT 
  orders.id AS order_id,
  orders.datetime,
  orders.quantity,

  users.email AS user_email,
  users.name AS user_name,

  shows.title AS show_title,
  shows.price AS show_price,
  (orders.quantity * shows.price) AS total_price

FROM orders
JOIN users ON orders.user_id = users.id
JOIN shows ON orders.show_id = shows.id;
```

