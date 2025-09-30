const API_BASE = 'http://127.0.0.1:8000/api';

interface Tokens { access: string; refresh: string }

export async function login(username: string, password: string): Promise<Tokens> {
  const res = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

async function refreshToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('No refresh token');
  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  localStorage.setItem('access', data.access);
  return data.access;
}

async function authFetch(url: string, options: RequestInit = {}) {
  let access = localStorage.getItem('access');
  const doFetch = async (token?: string) => {
    const headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    return fetch(url, { ...options, headers });
  };
  let res = await doFetch(access || undefined);
  if (res.status === 401 && localStorage.getItem('refresh')) {
    try {
      access = await refreshToken();
      res = await doFetch(access || undefined);
    } catch {
      logout();
    }
  }
  return res;
}

export async function getCurrentUser() {
  const res = await authFetch(`${API_BASE}/auth/me/`);
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function registerUser(payload: {
  username: string; password: string; email?: string;
  first_name?: string; last_name?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}
