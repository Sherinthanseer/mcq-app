document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".signup-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    localStorage.setItem("userFullname", fullname);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Account created successfully!");
    window.location.href = "login.html";
  });
});
