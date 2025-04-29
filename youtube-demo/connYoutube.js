
const mysql = require('mysql2');

const connYoutube = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    timezone : 'local',
    database: 'Youtube',
    dateStrings: true
  }
);


module.exports = connYoutube;