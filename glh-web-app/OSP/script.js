document.addEventListener("DOMContentLoaded", () => { //load script

  const post = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return { ok: res.ok, data: await res.json() };
  };

  // signup to web
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.onsubmit = async (e) => {
      e.preventDefault();

      const username = usernameInput.value,
            email = emailInput.value,
            password = passwordInput.value,
            confirm = confirmInput.value;
      if (!username || !email || !password || !confirm)
        return alert("All boxes must be filled to continue");
      if (password !== confirm)
        return alert("Passwords dont match");//user cannot continue - tells user why the signup was unsuccessful to prevent softlocks

      const r = await post("/signup", { username, email, password });
      alert(r.ok ? "Signed Up!" : r.data.message);

      if (r.ok) location.href = "login.html"; //user is immediately sent to login.html after making acc - intuitive design for user experience
    };
  }

  //login page
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();

      const email = emailInput.value,
            password = passwordInput.value;
      if (!email || !password)
        return alert("All boxes must be filled to continue"); //prevents user continuing with wrong or no details

      const r = await post("/login", { email, password });
      alert(r.ok ? "Logged in!" : r.data.message);

      if (r.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(r.data.user));
        location.href = "account.html";// sends user to account.html once confirming the user has managed to log into their account
      }
    };
  }

  // inputs 
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm"); // all user inputs here
});

// points referred to in the code to show on frontend 
document.addEventListener("DOMContentLoaded", function () {
    const pointsElement = document.getElementById("points");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user && pointsElement) {
        pointsElement.textContent = user.loyaltyPoints;
    }
});// loyalty points can be referred to and displayed to user
//however it only updates after signing out and back in -- dont know how to fix that or improve upon it

//refer to user in frontend
document.addEventListener("DOMContentLoaded", function () {
    const usernameElement = document.getElementById("username");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user && usernameElement) {
        usernameElement.textContent = user.username;
    }
}); //allows me to reference the username of the account for the account dashboard
//person who is logged in knows what their username is / logged into correct account 

//colour blind mode settings
function setMode(mode) {
  localStorage.setItem("colorMode", mode);
  applySettings();
}
function applySettings() {
  const mode = localStorage.getItem("colorMode") || "normal";
  document.body.className = mode === "normal" ? "" : mode;
}

window.onload = applySettings; //ensures the code runs first and doesnt break probably