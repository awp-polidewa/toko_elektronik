document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  // Ambil redirect URL dari query param
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect") || "/dashboard.html";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const nama = document.getElementById("nama").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, password }),
      });
      const data = await res.json();

      if (res.ok) {
        window.location.href = redirect;
      } else {
        errorMsg.textContent = data.error || "Login gagal";
      }
    } catch (err) {
      errorMsg.textContent = "Gagal terhubung ke server";
    }
  });
});
