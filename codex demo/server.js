/* eslint-disable no-console */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const HOST = process.env.HOST || "127.0.0.1";
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const PUBLIC_DIR = path.join(__dirname, "public");

const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const sessions = new Map(); // sid -> { userId, lastSeen }

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonIfExists(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function writeJsonAtomic(filePath, value) {
  const tmpPath = `${filePath}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tmpPath, filePath);
}

function nowIso() {
  return new Date().toISOString();
}

function createDefaultDb() {
  const userId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
  const email = "student@example.com";
  const password = "Password123!";
  const { salt, hash } = hashPassword(password);

  return {
    users: [
      {
        id: userId,
        email,
        password: { salt, hash, algo: "scrypt", keyLen: 64 },
        createdAt: nowIso()
      }
    ],
    studentsByUserId: {
      [userId]: {
        fullName: "Demo Student",
        studentId: "S-1001",
        major: "Computer Science",
        year: "2",
        phone: "555-0100",
        updatedAt: nowIso()
      }
    }
  };
}

function loadDb() {
  ensureDir(DATA_DIR);
  const existing = readJsonIfExists(DB_PATH);
  if (existing && typeof existing === "object") return existing;
  const db = createDefaultDb();
  writeJsonAtomic(DB_PATH, db);
  return db;
}

function saveDb(db) {
  writeJsonAtomic(DB_PATH, db);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  header.split(";").forEach((part) => {
    const [rawKey, ...rawVal] = part.trim().split("=");
    if (!rawKey) return;
    out[rawKey] = decodeURIComponent(rawVal.join("=") || "");
  });
  return out;
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge != null) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");
  const existing = res.getHeader("Set-Cookie");
  const next = existing ? ([]).concat(existing, parts.join("; ")) : parts.join("; ");
  res.setHeader("Set-Cookie", next);
}

function redirect(res, location) {
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.end();
}

function sendHtml(res, html, statusCode = 200) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

function sendText(res, text, statusCode = 200) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(text);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const typeByExt = {
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  };
  const contentType = typeByExt[ext] || "application/octet-stream";
  try {
    const data = fs.readFileSync(filePath);
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.end(data);
  } catch {
    sendText(res, "Not found", 404);
  }
}

function readBody(req, limitBytes = 1024 * 64) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseFormUrlEncoded(body) {
  const params = new URLSearchParams(body);
  const out = {};
  for (const [k, v] of params.entries()) out[k] = v;
  return out;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return { salt: salt.toString("base64"), hash: hash.toString("base64") };
}

function verifyPassword(password, passwordRecord) {
  if (!passwordRecord || passwordRecord.algo !== "scrypt") return false;
  const salt = Buffer.from(passwordRecord.salt, "base64");
  const expected = Buffer.from(passwordRecord.hash, "base64");
  const actual = crypto.scryptSync(password, salt, passwordRecord.keyLen || expected.length);
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function cleanupSessions() {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [sid, sess] of sessions.entries()) {
    if (!sess || typeof sess.lastSeen !== "number" || sess.lastSeen < cutoff) sessions.delete(sid);
  }
}

function getSession(req) {
  cleanupSessions();
  const cookies = parseCookies(req);
  const sid = cookies.sid;
  if (!sid) return null;
  const sess = sessions.get(sid);
  if (!sess) return null;
  sess.lastSeen = Date.now();
  return { sid, userId: sess.userId };
}

function createSession(res, userId) {
  const sid = crypto.randomBytes(24).toString("hex");
  sessions.set(sid, { userId, lastSeen: Date.now() });
  setCookie(res, "sid", sid, { path: "/", httpOnly: true, sameSite: "Lax", maxAge: Math.floor(SESSION_TTL_MS / 1000) });
}

function destroySession(req, res) {
  const cookies = parseCookies(req);
  if (cookies.sid) sessions.delete(cookies.sid);
  setCookie(res, "sid", "", { path: "/", httpOnly: true, sameSite: "Lax", maxAge: 0 });
}

function pageLayout({ title, content, userEmail, flash }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/public/styles.css" />
  </head>
  <body>
    <header class="topbar">
      <div class="brand">
        <div class="logo">CD</div>
        <div>
          <div class="brand-title">Codex Demo</div>
          <div class="brand-subtitle">Student Portal</div>
        </div>
      </div>
      <nav class="nav">
        ${userEmail ? `<span class="nav-email">${escapeHtml(userEmail)}</span>
        <a class="nav-link" href="/dashboard">Dashboard</a>
        <a class="nav-link" href="/edit">Edit</a>
        <a class="nav-link" href="/logout">Logout</a>` : `<a class="nav-link" href="/login">Login</a>
        <a class="nav-link" href="/register">Register</a>`}
      </nav>
    </header>
    <main class="container">
      ${flash ? `<div class="flash" role="status" aria-live="polite"><span class="flash-dot" aria-hidden="true"></span><div>${escapeHtml(flash)}</div></div>` : ""}
      ${content}
    </main>
    <footer class="footer">
      <span>© <span data-year></span> Codex Demo • Local demo app • No external dependencies</span>
    </footer>
    <script src="/public/app.js"></script>
  </body>
</html>`;
}

function landingPage() {
  const content = `
    <section class="landing">
      <div class="landing-hero">
        <div class="landing-copy">
          <div class="pill">Student Login Portal</div>
          <h1>College website with a clean student dashboard</h1>
          <p class="muted">Log in to view your student details, update your profile, and see a simple collage-style campus section.</p>
          <div class="cta">
            <a class="btn" href="/login">Login</a>
            <a class="btn secondary" href="/register">Register</a>
          </div>
          <div class="mini-note">
            Demo account: <code>student@example.com</code> / <code>Password123!</code>
          </div>
        </div>
        <div class="landing-panel" aria-hidden="true">
          <div class="collage-grid landing-collage">
            <div class="tile t1"></div>
            <div class="tile t2"></div>
            <div class="tile t3"></div>
            <div class="tile t4"></div>
            <div class="tile t5"></div>
            <div class="tile t6"></div>
          </div>
        </div>
      </div>

      <div class="feature-grid">
        <div class="feature">
          <div class="feature-title">Secure(ish) demo login</div>
          <div class="feature-text">Passwords are hashed with <code>scrypt</code> and sessions use an HttpOnly cookie.</div>
        </div>
        <div class="feature">
          <div class="feature-title">Student details</div>
          <div class="feature-text">Name, student ID, major, year, phone, and last updated time.</div>
        </div>
        <div class="feature">
          <div class="feature-title">No dependencies</div>
          <div class="feature-text">Built only with Node’s built-in modules + plain HTML/CSS/JS.</div>
        </div>
      </div>
    </section>
  `;
  return pageLayout({ title: "Home", content });
}

function loginPage({ flash }) {
  const content = `
    <div class="auth">
      <div class="card auth-card">
        <h1>Student Login</h1>
        <p class="muted">Use your email and password to access your student details.</p>
        <form method="post" action="/login" class="form">
          <label>Email
            <input name="email" type="email" autocomplete="email" placeholder="you@college.edu" required />
          </label>
          <label>Password</label>
          <div class="input-row">
            <input class="grow" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required data-pw />
            <button class="btn ghost" type="button" data-toggle-pw>Show</button>
          </div>
          <button type="submit" class="btn">Login</button>
        </form>
        <p class="muted">No account? <a href="/register">Register</a></p>
      </div>
      <div class="auth-side" aria-hidden="true">
        <div class="side-card">
          <div class="side-title">Quick preview</div>
          <div class="side-text">After login you’ll see a dashboard with your student details and a collage layout.</div>
          <div class="side-badges">
            <span class="badge">Dashboard</span>
            <span class="badge">Edit profile</span>
            <span class="badge">Collage</span>
          </div>
        </div>
      </div>
    </div>
  `;
  return pageLayout({ title: "Login", content, flash });
}

function registerPage({ flash }) {
  const content = `
    <div class="card">
      <h1>Register</h1>
      <p class="muted">Create your student login and profile.</p>
      <form method="post" action="/register" class="form grid2">
        <label>Full name
          <input name="fullName" placeholder="Jane Doe" required />
        </label>
        <label>Student ID
          <input name="studentId" placeholder="S-1002" required />
        </label>
        <label>Email
          <input name="email" type="email" autocomplete="email" placeholder="you@college.edu" required />
        </label>
        <label>Phone
          <input name="phone" placeholder="555-0123" />
        </label>
        <label>Major
          <input name="major" placeholder="Information Technology" required />
        </label>
        <label>Year
          <select name="year" required>
            <option value="">Select…</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
        <label class="span2">Password <span class="hint">(min 8 characters)</span></label>
        <div class="input-row span2">
          <input class="grow" name="password" type="password" autocomplete="new-password" minlength="8" placeholder="Create a strong password" required data-pw />
          <button class="btn ghost" type="button" data-toggle-pw>Show</button>
        </div>
        <button type="submit" class="btn span2">Create Account</button>
      </form>
      <p class="muted">Already have an account? <a href="/login">Login</a></p>
    </div>
  `;
  return pageLayout({ title: "Register", content, flash });
}

function dashboardPage({ userEmail, student }) {
  const s = student || {};
  const content = `
    <div class="hero">
      <div>
        <h1>Welcome, ${escapeHtml(s.fullName || "Student")}</h1>
        <p class="muted">Here are your saved student details.</p>
      </div>
      <div class="hero-actions">
        <a class="btn secondary" href="/edit">Edit Profile</a>
      </div>
    </div>

    <section class="grid">
      <div class="info-card">
        <div class="label">Student ID</div>
        <div class="value">${escapeHtml(s.studentId || "—")}</div>
      </div>
      <div class="info-card">
        <div class="label">Email</div>
        <div class="value">${escapeHtml(userEmail || "—")}</div>
      </div>
      <div class="info-card">
        <div class="label">Major</div>
        <div class="value">${escapeHtml(s.major || "—")}</div>
      </div>
      <div class="info-card">
        <div class="label">Year</div>
        <div class="value">${escapeHtml(s.year || "—")}</div>
      </div>
      <div class="info-card">
        <div class="label">Phone</div>
        <div class="value">${escapeHtml(s.phone || "—")}</div>
      </div>
      <div class="info-card">
        <div class="label">Last Updated</div>
        <div class="value">${escapeHtml(s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "—")}</div>
      </div>
    </section>

    <section class="collage">
      <h2>Campus Collage</h2>
      <p class="muted">A simple collage-style layout (placeholder tiles).</p>
      <div class="collage-grid" aria-hidden="true">
        <div class="tile t1"></div>
        <div class="tile t2"></div>
        <div class="tile t3"></div>
        <div class="tile t4"></div>
        <div class="tile t5"></div>
        <div class="tile t6"></div>
      </div>
    </section>
  `;
  return pageLayout({ title: "Dashboard", content, userEmail });
}

function editPage({ student, flash, userEmail }) {
  const s = student || {};
  const content = `
    <div class="card">
      <h1>Edit Student Details</h1>
      <form method="post" action="/edit" class="form grid2">
        <label>Full name
          <input name="fullName" value="${escapeHtml(s.fullName || "")}" required />
        </label>
        <label>Student ID
          <input name="studentId" value="${escapeHtml(s.studentId || "")}" required />
        </label>
        <label>Major
          <input name="major" value="${escapeHtml(s.major || "")}" required />
        </label>
        <label>Year
          <select name="year" required>
            <option value="">Select…</option>
            ${["1","2","3","4"].map((y) => `<option value="${y}" ${String(s.year) === y ? "selected" : ""}>${y}</option>`).join("")}
          </select>
        </label>
        <label class="span2">Phone
          <input name="phone" value="${escapeHtml(s.phone || "")}" />
        </label>
        <button type="submit" class="btn span2">Save</button>
      </form>
      <div class="divider"></div>
      <details class="details">
        <summary>Change password</summary>
        <form method="post" action="/change-password" class="form">
          <label>Current password
            <input name="currentPassword" type="password" autocomplete="current-password" required />
          </label>
          <label>New password
            <input name="newPassword" type="password" autocomplete="new-password" minlength="8" required />
          </label>
          <button type="submit" class="btn secondary">Update Password</button>
        </form>
      </details>
    </div>
  `;
  return pageLayout({ title: "Edit", content, userEmail, flash });
}

function getUserAndStudent(db, userId) {
  const user = db.users.find((u) => u.id === userId);
  const student = db.studentsByUserId[userId] || null;
  return { user, student };
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    if (pathname.startsWith("/public/")) {
      const rel = pathname.slice("/public/".length);
      const safePath = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");
      return sendFile(res, path.join(PUBLIC_DIR, safePath));
    }

    const db = loadDb();
    const session = getSession(req);

    const flash = url.searchParams.get("flash") || "";

    if (req.method === "GET" && pathname === "/") {
      if (session) return redirect(res, "/dashboard");
      return sendHtml(res, landingPage());
    }

    if (req.method === "GET" && pathname === "/login") {
      return sendHtml(res, loginPage({ flash }));
    }

    if (req.method === "POST" && pathname === "/login") {
      const body = await readBody(req);
      const form = parseFormUrlEncoded(body);
      const email = String(form.email || "").trim().toLowerCase();
      const password = String(form.password || "");
      const user = db.users.find((u) => u.email.toLowerCase() === email);
      if (!user || !verifyPassword(password, user.password)) {
        return redirect(res, "/login?flash=" + encodeURIComponent("Invalid email or password."));
      }
      createSession(res, user.id);
      return redirect(res, "/dashboard");
    }

    if (req.method === "GET" && pathname === "/register") {
      return sendHtml(res, registerPage({ flash }));
    }

    if (req.method === "POST" && pathname === "/register") {
      const body = await readBody(req);
      const form = parseFormUrlEncoded(body);
      const fullName = String(form.fullName || "").trim();
      const studentId = String(form.studentId || "").trim();
      const email = String(form.email || "").trim().toLowerCase();
      const phone = String(form.phone || "").trim();
      const major = String(form.major || "").trim();
      const year = String(form.year || "").trim();
      const password = String(form.password || "");

      if (!fullName || !studentId || !email || !major || !year || !password) {
        return redirect(res, "/register?flash=" + encodeURIComponent("Please fill in all required fields."));
      }
      if (!validateEmail(email)) {
        return redirect(res, "/register?flash=" + encodeURIComponent("Please enter a valid email address."));
      }
      if (password.length < 8) {
        return redirect(res, "/register?flash=" + encodeURIComponent("Password must be at least 8 characters."));
      }
      if (db.users.some((u) => u.email.toLowerCase() === email)) {
        return redirect(res, "/register?flash=" + encodeURIComponent("That email is already registered."));
      }

      const userId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
      const { salt, hash } = hashPassword(password);
      db.users.push({
        id: userId,
        email,
        password: { salt, hash, algo: "scrypt", keyLen: 64 },
        createdAt: nowIso()
      });
      db.studentsByUserId[userId] = { fullName, studentId, major, year, phone, updatedAt: nowIso() };
      saveDb(db);

      createSession(res, userId);
      return redirect(res, "/dashboard");
    }

    if (req.method === "GET" && pathname === "/logout") {
      destroySession(req, res);
      return redirect(res, "/login?flash=" + encodeURIComponent("Logged out."));
    }

    if (!session) {
      return redirect(res, "/login?flash=" + encodeURIComponent("Please log in first."));
    }

    const { user, student } = getUserAndStudent(db, session.userId);
    if (!user) {
      destroySession(req, res);
      return redirect(res, "/login?flash=" + encodeURIComponent("Session expired. Please log in again."));
    }

    if (req.method === "GET" && pathname === "/dashboard") {
      return sendHtml(res, dashboardPage({ userEmail: user.email, student }));
    }

    if (req.method === "GET" && pathname === "/edit") {
      return sendHtml(res, editPage({ student, flash, userEmail: user.email }));
    }

    if (req.method === "POST" && pathname === "/edit") {
      const body = await readBody(req);
      const form = parseFormUrlEncoded(body);
      const fullName = String(form.fullName || "").trim();
      const studentId = String(form.studentId || "").trim();
      const major = String(form.major || "").trim();
      const year = String(form.year || "").trim();
      const phone = String(form.phone || "").trim();

      if (!fullName || !studentId || !major || !year) {
        return redirect(res, "/edit?flash=" + encodeURIComponent("Please fill in all required fields."));
      }

      db.studentsByUserId[user.id] = {
        fullName,
        studentId,
        major,
        year,
        phone,
        updatedAt: nowIso()
      };
      saveDb(db);
      return redirect(res, "/dashboard");
    }

    if (req.method === "POST" && pathname === "/change-password") {
      const body = await readBody(req);
      const form = parseFormUrlEncoded(body);
      const currentPassword = String(form.currentPassword || "");
      const newPassword = String(form.newPassword || "");

      if (!verifyPassword(currentPassword, user.password)) {
        return redirect(res, "/edit?flash=" + encodeURIComponent("Current password is incorrect."));
      }
      if (newPassword.length < 8) {
        return redirect(res, "/edit?flash=" + encodeURIComponent("New password must be at least 8 characters."));
      }

      const { salt, hash } = hashPassword(newPassword);
      user.password = { salt, hash, algo: "scrypt", keyLen: 64 };
      saveDb(db);
      return redirect(res, "/edit?flash=" + encodeURIComponent("Password updated."));
    }

    return sendText(res, "Not found", 404);
  } catch (err) {
    console.error(err);
    return sendText(res, "Server error", 500);
  }
});

server.on("error", (err) => {
  console.error("Server failed to start:", err && err.message ? err.message : err);
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log(`Student portal running on http://${HOST}:${PORT}`);
});
