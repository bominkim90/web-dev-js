/* 
  채널 API
  '/channels'
  1회원 당 최대 100채널 생성 가능 
*/

const express = require('express')
const err_mySql = require('../errCode/err_mySql.js')
const connYoutube = require('../connYoutube.js')
const {body, validationResult} = require('express-validator') // 얘는 그냥 단순히 함수형태이고, 문자열의 validation 체크(정규식)해주는 애임
const router = express.Router();

// 유효성검사 미들웨어 함수
function validate(req, res, next) {
  const err = validationResult(req)

  if (!err.isEmpty()) {
    return res.status(400).json(err.array())
  }
  next()
}


/*************************************************************************************/
// 채널 <생성>
router.post('/',
  [
    body('user_email').notEmpty().isString().withMessage('문자 입력 필요'), // 내부적으로 (req, res, next) = {} 이런식으로 형태가 되어있고, next(err)를 알아서 호출하겠지
    body('url').notEmpty().isString().withMessage('문자 입력 필요'),
    body('title').notEmpty().isString().withMessage('문자 입력 필요'),
    validate
  ], // 미들웨어는 []배열에 담아도 되고, 안담고 ','콤마로 끊어서 여러개 등록해도 완전 동일한 기능임

  async (req, res) => {
    try {
      const {url, title, user_email} = req.body
      const [channelRows, _] = await connYoutube.promise().query(
        `INSERT INTO channels (url, title, user_email) VALUES (?, ?, ?);`, 
        [url, title, user_email]
      )
      return res.status(200).json({
        data : channelRows,
        message : "채널 생성에 성공하였습니다."
      })
    }

    catch (err) {
      console.error(err)
      err_mySql(err, res)
    }
  })


// 전체 채널 <조회>
router.get('/all',  
  async (req, res) => {
      try {
        const [allChannelRows, _] = await connYoutube.promise().query(
          `SELECT * FROM channels;`
        )
        return res.status(200).json(allChannelRows)
      }
      catch (err) {
        console.error(err)
        err_mySql(err, res)
      }
  })


// (특정 계정에 들어있는) '전체' 채널 <조회>
router.get('/', 
  body('user_email').notEmpty().isString().withMessage('문자 입력 필요'),
  validate,

  async (req, res) => {
    try {
      const {user_email} = req.body
      const [rows, fields] = await connYoutube.promise().query(
        `SELECT * FROM channels WHERE user_email = ?`, 
        user_email
      )
      res.status(200).json({
        data : rows,
        message : "해당 계정에 존재하는, 모든 채널 조회에 성공하였습니다"
      })
    }

    catch (err) {
      console.error(err)
      err_mySql(err, res)
    }
})


// '특정URL' 채널 <조회> (/channels/@채널url)
router.get('/:channelUrl', 
  body('user_email').notEmpty().isString().withMessage('문자 입력 필요'),
  validate,

  async (req, res) => {
    try {
      // 회원이 있는지 먼저 체크
      const {user_email} = req.body
      const [userRow, _] = await connYoutube.promise().query(
        `SELECT * FROM users WHERE email = ?`, user_email)
      if(userRow.length === 0) {
        return res.status(400).json({message : "존재하지 않는 회원 email 입니다"})
      }

      // 회원안에 특정URL 채널 있는지 체크
      const {channelUrl} = req.params
      const [channelRow, __] = await connYoutube.promise().query(
        `SELECT * FROM channels WHERE user_email = ? AND url = ?`, 
        [user_email, channelUrl]
      )
      if(channelRow.length === 0) {
        return res.status(400).json(channelRow)
      }

      // 특정URL 채널 찾기 성공
      res.status(200).json(channelRow)
    }

    catch (err) {
      console.error(err)
      err_mySql(err, res)
    }
  })


// 채널 <수정> : 한번에 하나의 데이터만 수정할 수 있음
router.put('/:targetColumn', 
  [
    body('user_email').notEmpty().isString().withMessage('문자 입력 필요'),
    body('ch_url').notEmpty().isString().withMessage('문자 입력 필요'),
    body('new_data').notEmpty().isString().withMessage('문자 입력 필요'),
    validate
  ],

  async (req, res) => {
    try {
      const {targetColumn} = req.params
      const {user_email, ch_url, new_data} = req.body

      // 로그인 체크
      const [userRow, _] = await connYoutube.promise().query(
        `SELECT * FROM users WHERE email = ?`, 
        user_email
      )
      if(userRow.length === 0) {
        return res.status(400).json({message : '존재하지 않는 계정입니다.'})
      }

      // 채널url 존재 체크
      const [channelUrlRow, __] = await connYoutube.promise().query(
        `SELECT * FROM channels WHERE url = ?`, 
        ch_url
      )
      if(channelUrlRow.length === 0) {
        return res.status(400).json({message : `해당 채널url은 존재하지 않습니다.`})
      }

      // 최종으로 채널 데이터 수정하기
      const [updatedRow, ___] = await connYoutube.promise().query(
        `UPDATE channels SET ${targetColumn} = ? WHERE url = ? AND user_email = ?`, 
        [new_data, ch_url, user_email]
      )
      if(updatedRow.affectedRows === 0) {
        return res.status(400).json({message : `수정된 채널url이 존재하지 않습니다.`})
      }
      res.status(200).json({
        data : updatedRow,
        message : `데이터 수정에 성공하였습니다`
      })
    }

    catch (err) {
      console.error(err)
      err_mySql(err, res)
    }
  })


// 채널 <삭제>
router.delete('/',
  [
    body('user_email').notEmpty().isString().withMessage('문자 입력 필요'),
    body('ch_url').notEmpty().isString().withMessage('문자 입력 필요'),
    validate
  ],
  
  async (req,res) => {
    try {
      // 로그인 확인
      const {user_email} = req.body
      const [userRow, _] = await connYoutube.promise().query(
        `SELECT * FROM users WHERE email = ?`, 
        user_email
      )
      if(userRow.length === 0) {
        return res.status(400).json({message : "로그인이 필요한 서비스 입니다."})
      }

      // 채널 url 존재 확인
      const {ch_url} = req.body
      const [channelRow, __] = await connYoutube.promise().query(
        `DELETE FROM channels WHERE url = ? AND user_email = ?`, 
        [ch_url, user_email]
      )
      if(channelRow.affectedRows === 0) {
        return res.status(400).json({message : "삭제된 채널이 없습니다."})
      }

      // 채널 삭제 성공
      res.status(200).json({
        data : channelRow,
        message : "해당 채널이 삭제되었습니다."
      })
    }

    catch (err) {
      console.error(err)
      err_mySql(err, res)
    }
  })

module.exports = router