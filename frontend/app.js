const API_URL = "http://localhost:8000";
// if (window.location.pathname.includes("dashboard.html") ||
//     window.location.pathname.includes("profile.html")) {
//     const token = localStorage.getItem("token");

//     if (!token) {
//         window.location.href = "login.html";
//     }
// }
// window.addEventListener("DOMContentLoaded", () => {
//     const token = localStorage.getItem("token");

//     if (!token &&
//         (window.location.pathname.includes("dashboard.html") ||
//          window.location.pathname.includes("profile.html"))) {
//         window.location.href = "login.html";
//     }
// });
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
    const res = await fetch(`${API_URL}/users/register`, {
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
    if (res.ok) {
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }
  } catch {
    showMessage("Server error");
  }
});
function showMessage(msg) {
  const el = document.getElementById("message");
  el.textContent = msg;
  el.style.display = "block";
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
        if (!payload.username || !payload.password) {
            showMessage("All fields are required");
            return;
        }
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            localStorage.setItem("token", data.access_token);
            showMessage("Login successful");
            // setTimeout(() => {
                window.location.href = "dashboard.html";
            // }, 300);
            // window.location.href = "dashboard.html";
        } else {
            showMessage(data.detail || "Invalid credentials");
        }

    } catch (err) {
        showMessage("Server not reachable");
    }
});

document.getElementById("calcForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const aValue = document.getElementById("a").value;
    const bValue = document.getElementById("b").value;
    const type = document.getElementById("type").value;

    // VALIDATION
        if (aValue === "" || bValue === "") {
        showMessage("Both numbers are required");
        return;
    }
    const a = Number(aValue);
    const b = Number(bValue);

    if (isNaN(a) || isNaN(b)) {
        showMessage("Only numbers allowed");
        return;
    }

    if (type === "division" && b === 0) {
        showMessage("Cannot divide by zero");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/calculations/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ a, b, type })
        });
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        if (res.ok) {
            document.getElementById("calcForm").reset();
            showMessage("Calculation created successfully");
        } else {
            showMessage(data.detail || data.error);
        }
        // showMessage(res.ok
        //     ? document.getElementById("calcForm").reset()
        //     : data.detail);
        loadCalculations();

    } catch (err) {
        showMessage("Server error");
    }
});

// ---------------- LOAD (BROWSE) ----------------
function loadCalculations() {
    fetch(`${API_URL}/calculations/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        return res.json();
    })
    .then(data => {
        const list = document.getElementById("list");
        list.innerHTML = "";
        if (data.length === 0) {
            list.innerHTML = "<p>No calculations yet</p>";
        }
        data.forEach(calc => {
            const li = document.createElement("li");

            li.innerHTML = `
                <div>
                    ${calc.a} ${calc.type} ${calc.b}
                    <b>= ${calc.result}</b>
                </div>

                <div class="actions">
                    <button onclick="viewCalc('${calc.id}')">View</button>
                    <button onclick="editCalc('${calc.id}')">Edit</button>
                    <button onclick="deleteCalc('${calc.id}')">Delete</button>
                </div>
            `;

            list.appendChild(li);
        });
    });
}

// ---------------- READ ----------------
function viewCalc(id) {
    fetch(`${API_URL}/calculations/${id}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        return res.json();
    })
    .then(data => {
        alert(
            `A: ${data.a}\nB: ${data.b}\nType: ${data.type}\nResult: ${data.result}`
        );
    });
}

// ---------------- EDIT ----------------
let currentEditId = null;
function editCalc(id) {
    currentEditId = id;

    fetch(`${API_URL}/calculations/${id}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }
        return res.json();
    })
    .then(data => {
        document.getElementById("editA").value = data.a;
        document.getElementById("editB").value = data.b;
        document.getElementById("editType").value = data.type;

        document.getElementById("editModal").classList.remove("hidden");
    });
}

async function submitEdit() {
    const a = Number(document.getElementById("editA").value);
    const b = Number(document.getElementById("editB").value);
    const type = document.getElementById("editType").value;

    if (isNaN(a) || isNaN(b) || !type) {
        showMessage("Invalid input values");
        return;
    }

    if (type === "division" && b === 0) {
        showMessage("Cannot divide by zero");
        return;
    }
    try {

        const res = await fetch(`${API_URL}/calculations/${currentEditId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ a, b, type })
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();

        if (res.ok) {
            showMessage("Calculation updated");
            loadCalculations();
            closeModal();
        } else {
            showMessage(data.detail || data.error);
        }

    } catch {
        showMessage("Operation failed");
    }
}

function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}

// ---------------- DELETE ----------------
function deleteCalc(id) {
    fetch(`${API_URL}/calculations/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }).then((res)=> {
        if (res.status === 204) {
            showMessage("Calculation deleted successfully");
            loadCalculations();
        } else if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        } else {
            showMessage("Delete failed");
        }
    })
    .catch(() => showMessage("Delete failed"));
}

async function loadProfile() {
        const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const res = await fetch(`${API_URL}/users/me`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    const data = await res.json();

    document.getElementById("profile_first_name").value = data.first_name;
    document.getElementById("profile_last_name").value = data.last_name;
    document.getElementById("profile_email").value = data.email;
    document.getElementById("profile_username").value = data.username;
}

document.getElementById("profileForm")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const payload = {
        first_name: document.getElementById("profile_first_name").value,
        last_name: document.getElementById("profile_last_name").value,
        email: document.getElementById("profile_email").value,
        username: document.getElementById("profile_username").value
    };

    try {

        const res = await fetch(`${API_URL}/users/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();

        if (res.ok) {
            showMessage("Profile updated successfully");
        } else {
            if (data.detail?.toLowerCase().includes("email")) {
                showMessage("Email already exists");
            } else if (data.detail?.toLowerCase().includes("username")) {
                showMessage("Username already exists");
            } else if (data.detail?.toLowerCase().includes("invalid email")) {
                showMessage("Invalid email");
            } else {
                showMessage(data.detail || data.error || "Profile update failed");
            }
        }
    } catch {
        showMessage("Profile update failed");
    }
});

document.getElementById("passwordForm")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const payload = {
        current_password: document.getElementById("current_password").value,
        new_password: document.getElementById("new_password").value
    };
    if (!payload.current_password || !payload.new_password) {
        showMessage("All password fields are required");
        return;
    }

    if (payload.new_password.length < 12) {
        showMessage("New password must be at least 12 characters");
        return;
    }

    try {

        const res = await fetch(`${API_URL}/users/change-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();

        if (res.ok) {

            showMessage("Password updated successfully. Please login again.");
            localStorage.removeItem("token");
            // setTimeout(() => {
                window.location.href = "login.html";
            // }, 3000);
        } else {
            showMessage(data.detail || data.error);
        }

    } catch {
        showMessage("Password change failed");
    }
});


function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}