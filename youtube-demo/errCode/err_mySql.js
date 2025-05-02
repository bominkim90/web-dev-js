
function err_mySql(err, res){
  if(err.code === 'ER_DUP_ENTRY') {
    res.status(400).json({
      message : "필수입력값에 중복된 값은 들어올 수 없습니다. 다른값을 넣어주세요."
    })
    return
  }
  if(err.code === 'ER_INNODB_AUTOEXTEND_SIZE_OUT_OF_RANGE') {
    res.status(400).json({
      message : "필수 입력사항에는 빈 값이 들어올 수 없습니다."
    })
    return
  }
  if(err.code === 'ER_NO_REFERENCED_ROW_2') {
    res.status(400).json({
      message : "외래키 제약 fail : 외래키로 설정되어있는 값이 -> 연결되어있는 테이블에 데이터 없음"
    })
    return
  }
  res.status(500).json({
    message : "서버에서 에러가 발생하였습니다."
  })
  return
}

module.exports = err_mySql