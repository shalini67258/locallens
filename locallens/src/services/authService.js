const BASE_URL = 'http://localhost:8080/api';

export const register = async (name, email, password, city) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, city })
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const saveToken = (token, name, email) => {
  localStorage.setItem('locallens_token', token);
  localStorage.setItem('locallens_user', JSON.stringify({ name, email }));
};

export const getToken = () => {
  return localStorage.getItem('locallens_token');
};

export const getUser = () => {
  const user = localStorage.getItem('locallens_user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('locallens_token');
  localStorage.removeItem('locallens_user');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('locallens_token');
};