// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    timezone : 'local',
    database: 'Youtube',
    dateStrings: true
  }
);


module.exports = connection;
