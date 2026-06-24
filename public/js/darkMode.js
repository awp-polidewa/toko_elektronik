const darkModeBtn = document.getElementById("darkModeBtn");
const moonIcon = document.getElementById("moonIcon");
const sunIcon = document.getElementById("sunIcon");

// Load theme dari localStorage
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  moonIcon.style.display = "none";
  sunIcon.style.display = "block";
}

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  moonIcon.style.display = isDark ? "none" : "block";
  sunIcon.style.display = isDark ? "block" : "none";
  localStorage.setItem("darkMode", isDark);
});
