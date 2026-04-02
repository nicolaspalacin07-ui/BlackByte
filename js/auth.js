/* =========================================================
   BLACKBYTE — Auth System (auth.js)
   Conectado al backend Node.js + MongoDB
   ========================================================= */

const API_URL = 'https://blackbyte-api-production.up.railway.app/api/auth';

/* ─── Helpers ──────────────────────────────────────────── */
function _saveSession(token, user) {
  localStorage.setItem('bb_token',   token);
  localStorage.setItem('bb_session', JSON.stringify(user));
}

function _clearSession() {
  localStorage.removeItem('bb_token');
  localStorage.removeItem('bb_session');
}

function getToken() {
  return localStorage.getItem('bb_token');
}

function getSession() {
  try {
    const raw = localStorage.getItem('bb_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function requireAuth() {
  if (!getSession()) window.location.replace('login.html');
}

/* ─── register(name, email, password) ─────────────────── */
async function register(name, email, password) {
  try {
    const res  = await fetch(`${API_URL}/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!data.ok) return { ok: false, error: data.error };
    return { ok: true };
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}

/* ─── login(email, password) ───────────────────────────── */
async function login(email, password) {
  try {
    const res  = await fetch(`${API_URL}/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.ok) return { ok: false, error: data.error };
    _saveSession(data.token, data.user);
    return { ok: true };
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}

/* ─── logout() ─────────────────────────────────────────── */
function logout() {
  _clearSession();
  window.location.href = 'index.html';
}

/* ─── getMe() — verifica token con el servidor ─────────── */
async function getMe() {
  const token = getToken();
  if (!token) return null;
  try {
    const res  = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.ok) { _clearSession(); return null; }
    return data.user;
  } catch {
    return null;
  }
}

/* ─── changePassword(currentPassword, newPassword) ─────── */
async function changePassword(currentPassword, newPassword) {
  try {
    const res  = await fetch('https://blackbyte-api-production.up.railway.app/api/user/change-password', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body:    JSON.stringify({ currentPassword, newPassword })
    });
    return await res.json();
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}

/* ─── changeEmail(newEmail, password) ──────────────────── */
async function changeEmail(newEmail, password) {
  try {
    const res  = await fetch('https://blackbyte-api-production.up.railway.app/api/user/change-email', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body:    JSON.stringify({ newEmail, password })
    });
    const data = await res.json();
    if (data.ok) {
      const session = getSession();
      if (session) { session.email = newEmail; _saveSession(getToken(), session); }
    }
    return data;
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}

/* ─── deleteAccount(password) ──────────────────────────── */
async function deleteAccount(password) {
  try {
    const res  = await fetch('https://blackbyte-api-production.up.railway.app/api/user/delete-account', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body:    JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.ok) _clearSession();
    return data;
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}

/* ─── Admin: createCourse(data) ────────────────────────── */
async function createCourse(data) {
  try {
    const res  = await fetch('https://blackbyte-api-production.up.railway.app/api/courses', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body:    JSON.stringify(data)
    });
    return await res.json();
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}

/* ─── Admin: getCourses(allIncludingDrafts) ─────────────── */
async function getCourses(adminAll = false) {
  try {
    const url  = adminAll ? 'https://blackbyte-api-production.up.railway.app/api/courses/all' : 'https://blackbyte-api-production.up.railway.app/api/courses';
    const opts = adminAll ? { headers: { 'Authorization': `Bearer ${getToken()}` } } : {};
    const res  = await fetch(url, opts);
    return await res.json();
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}

/* ─── Admin: deleteCourse(id) ──────────────────────────── */
async function deleteCourse(id) {
  try {
    const res = await fetch(`https://blackbyte-api-production.up.railway.app/api/courses/${id}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return await res.json();
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
}
