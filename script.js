document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    alert("الرجاء تعبئة جميع الحقول");
    return;
  }

  console.log("Email:", email);
  console.log("Password:", password);

  alert("تم تسجيل الدخول (تجريبي)");
});
