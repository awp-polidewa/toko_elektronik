document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const nama = document.getElementById("nama").value.trim();
    const password = document.getElementById("password").value;

    if (password.length < 4) {
      errorMsg.textContent = "Password minimal 4 karakter";
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, password }),
      });
      const data = await res.json();

      if (res.ok) {
        window.location.href = "/login.html?registered=1";
      } else {
        errorMsg.textContent = data.error || "Registrasi gagal";
      }
    } catch (err) {
      errorMsg.textContent = "Gagal terhubung ke server";
    }
  });
});
