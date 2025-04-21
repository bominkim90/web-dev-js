
// db_channels를 굳이 따로 둔 이유는
// 실제 유튜브같이 규모가 큰 서비스는 user, channels, videos 같이 테이블을 분리해둠
// 실제 DB에서는 channels테이블에만 채널 정보를 넣어두고, 
// users테이블의 id를 channels테이블에 외래키로 넣어두어서 종속시킨다.


// 여기서는 2 db 동시 수정해야함 
// (DB시스템처럼 외래키로 연결해두고 그걸로 다양한 데이터 조회가 안되기때문)

let db_channels = new Map();
db_channels.set('ch_bomin', {
  user_id : '김보민',
  url : 'ch_bomin',
  title : "내꺼임",
  videos : 10,
  subscribers : 100
});
db_channels.set('ch_bomin_2', {
  user_id : '김보민',
  url : 'ch_bomin_2',
  title : "내꺼임-2",
  videos : 0,
  subscribers : 0
});

db_channels.set('추성훈', {
  user_id : '추성훈',
  url : 'ch_chu',
  title : "추추트레인",
  videos : 100,
  subscribers : 10000 
});




module.exports = db_channels;