const darkModeBtn = document.getElementById("darkModeBtn");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    img1.style.display = "none";
    img2.style.display = "block";
    // darkModeBtn.textContent = "☀️ Light Mode";
  } else {
    // darkModeBtn.textContent = "🌙 Dark Mode";
    img1.style.display = "block";
    img2.style.display = "none";
  }
});
