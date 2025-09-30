const API_BASE = 'http://127.0.0.1:8000/api';

export function getTokens() {
  return {
    access: localStorage.getItem('access') || null,
    refresh: localStorage.getItem('refresh') || null,
  };
}

export function storeTokens(access, refresh) {
  if (access) localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

async function refreshAccess() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error('No refresh token');
  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  storeTokens(data.access, refresh);
  return data.access;
}

export async function authFetch(path, options = {}) {
  let { access } = getTokens();
  const attempt = async (token) => fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  let res = await attempt(access);
  if (res.status === 401 && getTokens().refresh) {
    try {
      access = await refreshAccess();
      res = await attempt(access);
    } catch {
      clearTokens();
    }
  }
  return res;
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  storeTokens(data.access, data.refresh);
  return data;
}

export async function fetchCurrentUser() {
  const res = await authFetch('/auth/me/');
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export function logout() {
  clearTokens();
}
