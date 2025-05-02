/* 
  회원 API 
  '/users'
*/
const express = require('express')
const router = express.Router();
const connYoutube = require('../connYoutube.js')
const err_mySql = require('../errCode/err_mySql.js')
const {body, validationResult} = require('express-validator') // 얘는 그냥 단순히 함수형태이고, 문자열의 validation 체크(정규식)해주는 애임

// 유효성검사 미들웨어 함수
function validate(req, res, next) {
  const err = validationResult(req)

  if (!err.isEmpty()) {
    return res.status(400).json(err.array())
  }
  next()
}


/*************************************************************************************/
router.route('/')

  // 회원 <가입>
  .post(
    body('email').notEmpty().isEmail().withMessage('email 형식 필요'),
    body('password').notEmpty().isString().withMessage('문자 입력 필요'),
    body('phone').notEmpty().isString().withMessage('문자 입력 필요'),
    validate,

    async (req, res) => { 
      const {email, password, phone} = req.body
      try {
        // users 테이블에 INSERT
        const [userRows, _] = await connYoutube.promise().query(
          `INSERT INTO users (email, password, phone) VALUES (?, ?, ?)`, 
          [email, password, phone]
        );
        // 회원가입 성공
        if(userRows.affectedRows === 1) {
          res.status(201).json({
            data : userRows,
            message : `'${email}'님, 회원이 되신걸 환영합니다.`
          });
        }
      }
      catch (err) {
        console.log(err)
        if(err.code == 'ER_DUP_ENTRY') {
          return res.status(400).json({message : `중복된 email 주소입니다.`});
        }
        res.status(400).json({message : "데이터를 올바르게 입력해주세요"})
      }
    })


  // 회원 <조회>
  .get( async (req, res) => { 
    try {
      if( !req.body || !req.body.user_email ) { // "전체" 조회
        const [allUsersRows, _] = await connYoutube.promise().query(
          'SELECT * FROM users'
        )
        return res.status(201).json(allUsersRows);
      }
      else { // "개별" 조회
        const [userRow, __] = await connYoutube.promise().query(
          'SELECT * FROM users WHERE email = ?', 
          req.body.user_email
        )
        if(userRow.length === 0){
          return res.status(400).send(`회원에 대한 정보가 존재하지 않습니다.`);
        }
        return res.status(200).json(userRow)
      }
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({message: `DB 조회 중 에러가 발생했습니다`})
    }
  })


  // 개별 <탈퇴>
  .delete(
    body('email').notEmpty().isEmail().withMessage('email 형식 필요'),
    body('password').notEmpty().isString().withMessage('문자 입력 필요'),
    validate,

    async (req, res) => {
      const {email, password} = req.body
      try {
        const [userRow, _] = await connYoutube.promise().query(
          `DELETE FROM users WHERE email = ? password = ?`, 
          [email, password]
        )
        // 탈퇴 성공
        if(userRow.affectedRows > 0) {
          return res.status(201).json(userRow)
        }
        else { // 회원 정보가 없음
          return res.status(400).json(userRow)
        }
      }
      catch (err) {
        console.log(err);
        res.status(500).json({
          message : `서버에서 에러가 발생하였습니다.`
        })
      }
    })




module.exports = router;