

let db_users = new Map();
db_users.set('김보민', {
  id : '김보민',
  password : '김보민비번',
  name : "보민짱",
  channels : {
    'ch_bomin_1' : {
      user_id : '김보민',
      url : 'ch_bomin_1',
      title : "내꺼임",
      videos : 10,
      subscribers : 1 
    }
  }
});
db_users.set('추성훈', {
  id : '추성훈',
  password : '추성훈비번',
  name : "추추",
  channels : {
    user_id : '추성훈',
    url : 'ch_chu',
    title : "추추트레인",
    videos : 100,
    subscribers : 10000 
  }
});



module.exports = db_users;
