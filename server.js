const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const pool = require("./config/database");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "rahasia_toko_elektronik",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 hari
  })
);

// ============ AUTH MIDDLEWARE ============
// Redirect ke login jika user belum login saat mengakses halaman terproteksi
const halamanTerproteksi = ["/dashboard.html", "/detail.html"];

app.use((req, res, next) => {
  if (req.method === "GET" && halamanTerproteksi.includes(req.path)) {
    if (!req.session.userId) {
      const returnUrl = encodeURIComponent(req.originalUrl);
      return res.redirect(`/login.html?redirect=${returnUrl}`);
    }
  }
  next();
});

// Static files — ditaruh SETELAH auth middleware agar proteksi berlaku
app.use(express.static(path.join(__dirname, "public"), { index: false }));

// Redirect root ke dashboard
app.get("/", (req, res) => {
  res.redirect("/dashboard.html");
});

// ============ AUTH API ============

// Registrasi
app.post("/api/register", async (req, res) => {
  try {
    const { nama, password } = req.body;
    if (!nama || !password) {
      return res.status(400).json({ error: "Nama dan password wajib diisi" });
    }
    if (password.length < 4) {
      return res
        .status(400)
        .json({ error: "Password minimal 4 karakter" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (nama, password) VALUES (?, ?)", [
      nama,
      hashed,
    ]);
    res.json({ message: "Registrasi berhasil, silakan login" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Nama sudah terdaftar" });
    }
    console.error("Register error:", err);
    res.status(500).json({ error: "Gagal registrasi: " + err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { nama, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE nama = ?", [
      nama,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Nama atau password salah" });
    }
    const user = rows[0];
    const cocok = await bcrypt.compare(password, user.password);
    if (!cocok) {
      return res.status(401).json({ error: "Nama atau password salah" });
    }
    req.session.userId = user.id;
    req.session.userNama = user.nama;
    res.json({ message: "Login berhasil", user: { id: user.id, nama: user.nama } });
  } catch (err) {
    res.status(500).json({ error: "Gagal login" });
  }
});

// Cek session (untuk refresh halaman)
app.get("/api/session", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, user: { id: req.session.userId, nama: req.session.userNama } });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logout berhasil" });
});

// ============ PRODUK API ============

// Ambil semua produk
app.get("/api/produk", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM produk");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// Ambil detail produk by ID (dengan proteksi login)
app.get("/api/produk/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Silakan login dulu" });
  }
  try {
    const [rows] = await pool.query("SELECT * FROM produk WHERE id_produk = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil detail" });
  }
});

// ============ SERVER ============

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
