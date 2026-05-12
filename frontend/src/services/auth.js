const TOKEN_KEY = 'access_token';

export const login = async (username, password) => {
  const form = new URLSearchParams({ username, password });
  const res = await fetch('/auth/login', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  sessionStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
};

export const logout = () => sessionStorage.removeItem(TOKEN_KEY);

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => !!getToken();

export const getMe = async () => {
  const res = await fetch('/users/me', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};
