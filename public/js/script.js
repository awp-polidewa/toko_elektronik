// const { response } = require("express");
// const btn = document.getElementById("darkMOdeBtn");
// btn.addEventListener("click", (e) => {
//     document.body.classList.toggle("dark-mode");
// });

fetch("/produk")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const container = document.getElementById("produk");

    data.forEach((item) => {
      container.innerHTML += `
        <tr>
            <td>${item.id_produk}</td>
            <td>${item.nama_produk}</td>
            <td>${item.kategori}</td>
            <td>Rp ${item.harga.toLocaleString()}</td>
            <td>${item.stok}</td>
        </tr>
            `;
    });
  })
  .catch((error) => console.log(error));
