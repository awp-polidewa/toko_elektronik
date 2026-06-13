const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "toko_elektronik",
});

db.connect((err) => {
  if (err) {
    console.log("koneksi gagal: ", err);
    return;
  }
  console.log("database berhasil terhubung");
});

module.exports = db;
