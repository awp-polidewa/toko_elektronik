document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("produk");
  const userDisplay = document.getElementById("userDisplay");
  const authBtns = document.getElementById("authBtns");
  const logoutBtn = document.getElementById("logoutBtn");
  const searchInput = document.getElementById("search");
  let semuaProduk = [];

  // ===== Session Check =====
  async function checkSession() {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.loggedIn) {
        userDisplay.textContent = `Halo, ${data.user.nama}`;
        authBtns.style.display = "none";
        logoutBtn.style.display = "inline-block";
      } else {
        userDisplay.textContent = "";
        authBtns.style.display = "inline-flex";
        logoutBtn.style.display = "none";
      }
    } catch (e) {
      console.log("Session check gagal");
    }
  }

  // ===== Load Product Data =====
  async function loadProduk() {
    try {
      const res = await fetch("/api/produk");
      semuaProduk = await res.json();
      renderProduk(semuaProduk);
    } catch (err) {
      container.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#e74c3c;">Gagal memuat data produk</td></tr>`;
    }
  }

  function renderProduk(data) {
    container.innerHTML = "";
    if (data.length === 0) {
      container.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tidak ada produk ditemukan</td></tr>`;
      return;
    }
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id_produk}</td>
        <td>${item.nama_produk}</td>
        <td>${item.kategori}</td>
        <td>Rp ${item.harga.toLocaleString()}</td>
        <td>${item.stok}</td>
        <td><a href="detail.html?id=${item.id_produk}" class="btn-detail">Detail</a></td>
      `;
      container.appendChild(row);
    });
  }

  // ===== Search Filter =====
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const rows = container.querySelectorAll("tr");
    rows.forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(keyword)
        ? ""
        : "none";
    });
  });

  // ===== Logout =====
  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  });

  // ===== Init =====
  checkSession();
  loadProduk();
});
