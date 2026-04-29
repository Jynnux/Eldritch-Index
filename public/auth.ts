const statusEl = document.getElementById("status") as HTMLParagraphElement;

function setStatus(msg: string, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "red" : "green";
}

async function signup() {
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const res = await fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    setStatus(data.message || "Signup failed", true);
    return;
  }

  setStatus("Account created!");
}

async function login() {
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    setStatus(data.message || "Login failed", true);
    return;
  }

  setStatus("Logged in!");
}