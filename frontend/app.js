const API_URL = "http://localhost:8000";

// ---------------- REGISTER ----------------
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  };
    if (
    !payload.first_name ||
    !payload.last_name ||
    !payload.email ||
    !payload.username ||
    !payload.password) {
        showMessage("All fields are required");
        return;
    }
  if (payload.password.length < 12) {
    showMessage("Password must be minimum 12 characters");
    return;
  }

  if (!payload.email.includes("@")) {
    showMessage("Invalid email");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/users/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    let data = {};

    try {
      data = await res.json();
    } catch {}

    const msg = res.ok
      ? "Registration successful"
      : (data.detail || data.error || "User already exists");

    showMessage(msg);

  } catch {
    showMessage("Server error");
  }
});
function showMessage(msg) {
  const el = document.getElementById("message");
  el.textContent = msg;
//   el.style.display = "block";
}

// ---------------- LOGIN ----------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // const messageEl = document.getElementById("message");
    showMessage(""); // Clear previous message
    const payload = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    try {
        const res = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            localStorage.setItem("token", data.access_token);
            showMessage("Login successful");
        } else {
            showMessage(data.detail || "Invalid credentials");
        }

    } catch (err) {
        showMessage("Server not reachable");
    }
});
