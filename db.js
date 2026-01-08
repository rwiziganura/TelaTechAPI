const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "KigaliinnovationDB"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;
