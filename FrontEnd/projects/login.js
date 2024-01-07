const element = {
  email: document.querySelector("#emaile"),
  password: document.querySelector("#passworde"),
  submit: document.querySelector("#submit"),
};

const erreurMessage = document.querySelector(".error-msg-login");

// EVENT AU CLIC SUR LE BOUTON LOGIN
submit.addEventListener("click", (a) => {
  a.preventDefault();

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: element.email.value,
      password: element.password.value,
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      sessionStorage.setItem("Token", data.token);

      if (data.message || data.error) {
        erreurMessage.style.display = "block";
        setTimeout(() => {
          erreurMessage.style.display = "none";
        }, 5000);
      } else {
        sessionStorage.setItem("isConnected", JSON.stringify(true));
        window.location.replace("index.html");
      }
    });
});
