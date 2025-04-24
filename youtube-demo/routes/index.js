
const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
  res.send("유튜브에 오신걸 환경합니다.");
});


module.exports = router;