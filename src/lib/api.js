const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const { method = 'GET', body, auth = true } = options;
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authApi = {
  signup: (body) => request('/auth/signup', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

export const userApi = {
  get: (id) => request(`/users/${id}`, { auth: false }),
  update: (id, body) => request(`/users/${id}`, { method: 'PUT', body }),
  follow: (id) => request(`/users/${id}/follow`, { method: 'POST' }),
  followers: (id) => request(`/users/${id}/followers`, { auth: false }),
  following: (id) => request(`/users/${id}/following`, { auth: false }),
  suggestions: () => request('/users/suggestions'),
};

export const postApi = {
  feed: (params = '') => request(`/posts?${params}`),
  get: (id) => request(`/posts/${id}`, { auth: false }),
  create: (body) => request('/posts', { method: 'POST', body }),
  like: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
  save: (id) => request(`/posts/${id}/save`, { method: 'POST' }),
  comments: (id) => request(`/posts/${id}/comments`, { auth: false }),
  addComment: (id, body) => request(`/posts/${id}/comments`, { method: 'POST', body }),
};

export const messageApi = {
  conversations: () => request('/messages/conversations'),
  get: (userId) => request(`/messages/${userId}`),
  send: (body) => request('/messages', { method: 'POST', body }),
};

export const notifApi = {
  list: () => request('/notifications'),
  readAll: () => request('/notifications/read-all', { method: 'PUT' }),
  unreadCount: () => request('/notifications/unread-count'),
};

export const uploadApi = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API}/upload`, { method: 'POST', credentials: 'include', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};