const express = require('express');
const router = express.Router();
const err_mySql = require('../errCode/err_mySql.js')

const connYoutube = require('../connYoutube.js');

let db_users = require('../db/db_users.js');
let db_channels = require('../db/db_channels.js');

/* '/channels' API */


// 회원 채널 <생성>
router.post('/', async (req,res) => {
  const {url, title, user_email} = req.body;
  if(!url || !title || !user_email) {
    res.status(400).json({
      message : "채널생성 정보에는 (빈값, 0, 공백) 만 들어올 수는 없습니다."
    })
    return
  }
  try {
    const sql = `INSERT INTO channels (url, title, user_email) VALUES (?, ?, ?);`
    const sqlValues = [url, title, user_email]
    const [rows, fields] = await connYoutube.promise().query(sql, sqlValues)
    console.log("rows : ",rows);
    console.log("fields : ",fields);
  
    res.status(200).json({
      data : {url, title, user_email}
    })
  }
  catch (err) {
    console.log(err);
    err_mySql(err, res);
  }
});


// 채널 전체 <조회>
router.get('/', async (req, res) => {
  if(!req.body) { // 전체 채널 조회
    try {
      const sql = `SELECT * FROM channels;`
      const [rows, fields] = await connYoutube.promise().query(sql)
      console.log("rows : ",rows);
      res.status(200).json({
        data : rows,
        message : "채널 전체 조회 성공하였습니다"
      })
    }
    catch (err) {
      console.log(err);
      err_mySql(err, res);
    }
  }
  else { // 계정 채널 조회
    const {user_email} = req.body
    if(!user_email) {
      res.status(200).json({
        message : "email을 정확히 입력해주세요"
      })
      return
    }
    try {
      const sql = `SELECT * FROM channels WHERE user_email = ?`
      const sqlValues = user_email
      const [rows, fields] = await connYoutube.promise().query(sql, sqlValues)
      console.log("rows : ",rows);
      res.status(200).json({
        data : rows,
        message : "해당 계정에 존재하는, 모든 채널 조회에 성공하였습니다"
      })
    }
    catch (err) {
      console.log(err);
      err_mySql(err, res);
    }
  }
});


// '특정URL' 채널 <조회>
router.get('/:channelUrl', async (req, res) => {
  console.log("특정url 채널 조회")
  if(!req.body) {
    res.status(400).json({
      message : "로그인을 해야 조회할 수 있는 정보입니다."
    })
    return
  }
  const {user_email} = req.body
  if(!user_email) {
    res.status(400).json({
      message : "email을 정확히 입력해주세요."
    })
    return
  }

  try {
    // 회원이 있는지 먼저 체크
    const [userRow, userField] = await connYoutube.promise().query(
      `SELECT * FROM users WHERE email = ?`, user_email)
    console.log(userRow)
    if(userRow.length === 0) {
      res.status(400).json({
        message : "존재하지 않는 회원 email 입니다다"
      })
      return
    }

    // 그다음 회원안에 채널 정보 조회
    const {channelUrl} = req.params
    const sql = `SELECT * FROM channels WHERE user_email = ? AND url = ?`
    const sqlValues = [user_email, channelUrl]
    const [rows, fields] = await connYoutube.promise().query(sql, sqlValues)
    console.log("rows : ",rows);
    if(rows.length === 0) {
      res.status(400).json({
        message : `'${user_email}' 계정에 존재하는, '${channelUrl}' url 채널 정보가 존재하지 않습니다.`,
        data : rows
      })
    }
    res.status(200).json({
      message : `'${user_email}' 계정에 존재하는, '${channelUrl}' url 채널 조회에 성공하였습니다`,
      data : rows
    })
  }
  catch (err) {
    console.log(err);
    err_mySql(err, res);
  }
});


// 회원 채널 <수정> : 한번에 하나의 데이터만 수정할 수 있음
router.put('/:updateColumn', async (req, res) => {
  try {
    const {updateColumn} = req.params
    const {user_email, ch_url, new_data} = req.body
    if( !user_email || !ch_url || !new_data ) {
      res.status(400).json({message : `데이터를 정확히 입력해주세요.`})
      return
    }
    // 로그인 체크
    const [userRows, userFields] = await connYoutube.promise().query(
      `SELECT * FROM users WHERE email = ?`, user_email)
    if(userRows.length === 0) {
      res.status(400).json({message : `로그인이 필요한 서비스입니다.`})
      return
    }
    // 채널url 존재 체크
    const [channelUrlRows, channelUrlFields] = await connYoutube.promise().query(
      `SELECT * FROM channels WHERE url = ?`, ch_url)
    if(channelUrlRows.length === 0) {
      res.status(400).json({message : `해당 채널url은 존재하지 않습니다.`})
      return
    }
    // 수정하기
    const [updatedRows, updatedFields] = await connYoutube.promise().query(
      `UPDATE channels SET ${updateColumn} = ? WHERE url = ? AND user_email = ?`, 
      [new_data, ch_url, user_email]
    )
    console.log(updatedRows)
    res.status(200).json({
      user_email,
      ch_url,
      updateColumn,
      new_data,
      message : `데이터 수정에 성공하였습니다`
    })
  }
  catch (err) {
    console.log(err);
    err_mySql(err, res);
  }
});


// 회원 채널 <삭제>
router.delete('/', async (req,res) => {
  const {user_email, ch_url} = req.body
  if( !user_email || !ch_url ) {
    res.status(400).json({
      message : "필수입력값을 제대로 입력해주세요."
    })
    return
  }
  
  try {
    // 로그인 확인
    const [userRows, userFields] = await connYoutube.promise().query(
      `SELECT * FROM users WHERE email = ?`, user_email
    )
    console.log("userRows :",userRows)
    if(userRows.length === 0) {
      res.status(400).json({
        message : "해당 계정은 존재하지 않습니다다"
      })
      return
    }
    // 채널 url 존재 확인
    const [channelRows, channelFields] = await connYoutube.promise().query(
      `DELETE FROM channels WHERE url = ? AND user_email = ?`, [ch_url, user_email]
    )
    console.log("channelRows :",channelRows)
    if(channelRows.affectedRows === 0) {
      res.status(400).json({
        message : "해당 채널이 존재하지 않습니다."
      })
      return
    }
    res.status(400).json({
      message : "해당 채널이 삭제되었습니다."
    })
  }

  catch (err) {
    console.log(err);
    err_mySql(err, res);
  }
  // 채널 url 존재하는지 확인
});

module.exports = router;