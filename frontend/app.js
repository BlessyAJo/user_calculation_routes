const API_URL = "http://localhost:8000";
if (window.location.pathname.includes("dashboard.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
}
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

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            localStorage.setItem("token", data.access_token);
            showMessage("Login successful");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);
        } else {
            showMessage(data.detail || "Invalid credentials");
        }

    } catch (err) {
        showMessage("Server not reachable");
    }
});

document.getElementById("calcForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const a = Number(document.getElementById("a").value);
    const b = Number(document.getElementById("b").value);
    const type = document.getElementById("type").value;

    // const msgEl = document.getElementById("createMsg");

    // VALIDATION
        if (a === "" || b === "") {
        showMessage("Both numbers are required");
        return;
    }

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

        const data = await res.json();

        showMessage(res.ok
            ? `Result = ${data.result}`
            : data.detail);
        if(res.ok){
            document.getElementById("calcForm").reset();
        }
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
    .then(res => res.json())
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
    .then(res => res.json())
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
    .then(res => res.json())
    .then(data => {
        document.getElementById("editA").value = data.a;
        document.getElementById("editB").value = data.b;
        document.getElementById("editType").value = data.type;

        document.getElementById("editModal").classList.remove("hidden");
    });
}

function submitEdit() {
    const a = Number(document.getElementById("editA").value);
    const b = Number(document.getElementById("editB").value);
    const type = document.getElementById("editType").value;

    if (isNaN(a) || isNaN(b) || !type) return;


    if (type === "division" && b === 0) {
        showMessage("Cannot divide by zero");
        return;
    }

    fetch(`${API_URL}/calculations/${currentEditId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ a, b, type })
    })
    .then(res => res.json())
    .then(() => {
        loadCalculations();
    })
    .catch(() => showMessage("Operation failed"));
    closeModal();
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
    }).then(() => loadCalculations()
    .catch(() => showMessage("Delete failed")));
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}