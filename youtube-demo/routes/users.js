
const express = require('express');
const router = express.Router();

const connYoutube = require('../connYoutube.js');


// users 회원 API
router.route('/')

  // <가입>
  .post( async (req, res) => { 
    const {user_email, user_pw, user_phone} = req.body;
    if(!user_email || !user_pw || !user_phone) {
      res.status(400).send("회원 정보를 모두 입력해주세요.")
      return;
    }

    try {
      const [rows, fields] = await connYoutube.promise().query(
        `INSERT INTO users (email, password, phone)
        VALUES (?, ?, ?)`, [user_email, user_pw, user_phone]
      );
      if(rows.affectedRows === 1) {
        res.status(201).json({
          message : `'${user_email}'님, 회원이 되신걸 환영합니다.`
        });
      }
    }
    catch (err) {
      console.log(err)
      if(err.code == 'ER_DUP_ENTRY') { // mariadb에서 INSERT 쿼리에서 "중복" 에러
        res.status(400).json({
          message : `'${user_email}'이 값은 중복된 email 주소입니다. 다른 email주소를 입력해주세요.`
        });
        return;
      }
      res.status(400).json({
        message : "데이터를 올바르게 입력해주세요"
      })
    }
  })

  // <조회>
  .get( async (req, res) => { 
    try {
      let {email} = req.body;
      if(!email) { // "전체" 조회
        const [rows, fileds] = await connYoutube.promise().query(
          'SELECT * FROM users'
        );
        res.status(201).json({
          data : rows
        });
      }
      else { // "개별" 조회
        const [rows, fields] = await connYoutube.promise().query(
          `SELECT * FROM users WHERE email = ?`, email
        )
        if(rows.length === 0){
          res.status(400).send(`'${email}' 회원에 대한 정보가 존재하지 않습니다.`);
          return;
        }
        return res.status(200).json({
          data: rows
        })
      }
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `DB 조회 중 에러가 발생했습니다`
      })
    }
  })

  // 개별 <탈퇴>
  .delete( async (req, res) => { 
    const {user_email} = req.body;
    if(!user_email) { // 빈 값 체크
      res.status(400).send("회원정보에 빈값은 들어올 수 없습니다.")
      return;
    }
    try {
      const [rows, fields] = await connYoutube.promise().query(
        `DELETE FROM users WHERE email = ?`, user_email
      );
      if(rows.affectedRows > 0) { // 탈퇴 성공
        res.status(201).json({
          message : `'${user_email}'님, 회원탈퇴에 성공하였습니다.`
        });
      }
      else { // 회원 정보가 없음
        res.status(400).json({
          message : `'${user_email}' 계정이 존재하지 않습니다.`
        });
      }
    }
    catch (err) {
      console.log(err);
      res.status(500).json({
        message : `서버에서 에러가 발생하였습니다.`
      });
    }
  });




module.exports = router;