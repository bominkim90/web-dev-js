
// db_channels를 굳이 따로 둔 이유는
// 실제 유튜브같이 규모가 큰 서비스는 user, channels, videos 같이 테이블을 분리해둠
// 실제 DB에서는 channels테이블에만 채널 정보를 넣어두고, 
// users테이블의 id를 channels테이블에 외래키로 넣어두어서 종속시킨다.



let db_channels = new Map();
db_channels.set(
  'ch_bomin', {
    ch_url : 'ch_bomin',
    ch_title : "내꺼임",
    user_id : '김보민' // FK(외래키)
  }
);
db_channels.set(
  'ch_bomin_2', {
    ch_url : 'ch_bomin_2',
    ch_title : "내꺼임-2",
    user_id : '김보민'
}
);

db_channels.set(
  '추성훈', {
    ch_url : 'ch_chu',
    ch_title : "추추트레인",
    user_id : '추성훈'
  }
);




module.exports = db_channels;