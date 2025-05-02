var jwt = require('jsonwebtoken'); // jwt 모듈 소환
var dotenv = require('dotenv');

// console.log('cwd:', process.cwd());
// console.log('__dirname:', __dirname);

dotenv.config();

// token 생성(= jwt에 서명) : 페이로드, 나만의 암호키 (+ SHA256 알고리즘으로 작성)
var token = jwt.sign( {foo: 'bar'}, process.env.PRIVATE_KEY );
// console.log(token);

// 검증 => 성공하면 페이로드 값을 확인할 수 있음
var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
console.log(decoded)