document.addEventListener("DOMContentLoaded", async () => {
  const userDisplay = document.getElementById("userDisplay");
  const authBtns = document.getElementById("authBtns");
  const logoutBtn = document.getElementById("logoutBtn");
  const loadingMsg = document.getElementById("loadingMsg");
  const detailCard = document.getElementById("detailCard");
  const errorCard = document.getElementById("errorMsg");
  const detailNama = document.getElementById("detailNama");
  const detailId = document.getElementById("detailId");
  const detailKategori = document.getElementById("detailKategori");
  const detailHarga = document.getElementById("detailHarga");
  const detailStok = document.getElementById("detailStok");

  // Ambil ID dari URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    loadingMsg.style.display = "none";
    errorCard.style.display = "block";
    errorCard.querySelector("p").textContent = "ID produk tidak ditemukan.";
    return;
  }

  // ===== Session Check =====
  async function checkSession() {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.loggedIn) {
        userDisplay.textContent = `Halo, ${data.user.nama}`;
        authBtns.style.display = "none";
        logoutBtn.style.display = "inline-block";
        return true;
      } else {
        userDisplay.textContent = "";
        authBtns.style.display = "inline-flex";
        logoutBtn.style.display = "none";
        // Redirect ke login dengan return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login.html?redirect=${returnUrl}`;
        return false;
      }
    } catch (e) {
      console.log("Session check gagal");
      return false;
    }
  }

  // ===== Load Detail =====
  async function loadDetail() {
    try {
      const res = await fetch(`/api/produk/${id}`);
      if (!res.ok) {
        throw new Error("Gagal mengambil detail");
      }
      const item = await res.json();

      detailNama.textContent = item.nama_produk;
      detailId.textContent = item.id_produk;
      detailKategori.textContent = item.kategori;
      detailHarga.textContent = `Rp ${item.harga.toLocaleString()}`;
      detailStok.textContent = item.stok;

      loadingMsg.style.display = "none";
      detailCard.style.display = "block";
    } catch (err) {
      loadingMsg.style.display = "none";
      errorCard.style.display = "block";
    }
  }

  // ===== Logout =====
  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  });

  // ===== Init =====
  const loggedIn = await checkSession();
  if (loggedIn) {
    loadDetail();
  }
});
