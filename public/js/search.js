const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const rows = document.querySelectorAll("#produk tr");

  rows.forEach((row) => {
    const isiBaris = row.textContent.toLowerCase();

    if (isiBaris.includes(keyword)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
