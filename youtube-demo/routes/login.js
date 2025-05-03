/* /login 로그인API */

// 필요 모듈 소환
const express = require('express')
const router = express.Router()
const connYoutube = require('../connYoutube.js')
const {body, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config() // env파일 읽고 파싱 -> node.js 안에서 설정값 가져다 쓸 수 있음


// 미들웨어 함수
function validate(req, res, next) { // 유효성 검사
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json(err.array())
  }
  next()
}


/*****************************************************************************/
// 로그인 검증
router.post('/',
  body('email').notEmpty().isEmail().withMessage('email 형식 필요'),
  body('password').notEmpty().isString().withMessage('문자 입력 필요'),
  validate,
  
  async (req, res) => {
    const {email, password} = req.body
    try {
      // email 존재 체크
      const [emailRows, _] = await connYoutube.promise().query(
        `SELECT email FROM users WHERE email = ?`, 
        email
      )
      if( emailRows.length === 0 ) { 
        return res.status(401).json({message: "해당 email 계정이 없습니다."})
      }
      // password 체크 (email에 password가 매칭되는지)
      const [passwordRows, __] = await connYoutube.promise().query(
        `SELECT email, password FROM users WHERE email = ? AND password = ?`, 
        [email, password]
      )
      if( passwordRows.length === 0 ) { 
        return res.status(401).json({message: "비밀번호를 올바르게 입력해주세요."})
      }
      // (401) status code : 클라이언트는 요청한 응답을 받기 위해서는 반드시 스스로를 인증해야 합니다.

      // 로그인 성공
      const token = jwt.sign( // jwt 발행 메서드
        { // payload (내용)
          email : email,
          expire : "만료날짜",
        }, 
        process.env.PRIVATE_KEY, // 암호키
        { // option
          expiresIn : '5m', // 유효기간
          issuer : "bomin" // 발행자
        }
      )

      res.status(201)
      // Set-Cookie라는 응답 헤더에 JWT를 담아 보내면, 브라우저가 자동으로 쿠키에 저장해준다.
      .cookie("token", token, {
        httpOnly : true
      })
      .json({message : `'${email}'님, 로그인에 성공하셨습니다.`})
    }
    
    catch (err) {
      console.log(err)
    }
  })


module.exports = router