document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (email === storedEmail && password === storedPassword) {
      alert("Login successful!");
      // Redirect or load the dashboard page here
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  });
});
