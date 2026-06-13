const express = require("express");
const path = require("path");
const db = require("./config/database");
const { error } = require("console");

const app = express();
const port = 3000;

// akses folder publik
app.use(express.static(path.join(__dirname, "public")));

//ambil smua isi tabel produk ges
app.get("/produk", (req, res) => {
  db.query("SELECT * FROM produk", (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "gagal mengambil data",
        error: err,
      });
    }
    res.json(results);
  });
});

// jalankan server sir
app.listen(port, () => {
  console.log(`server berjalan di http://localhost:${port}`);
});
