const BASE_URL = 'http://localhost:8080/api';

export const getAllPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts`);
  return response.json();
};

export const createPost = async (post) => {
  const token = localStorage.getItem('locallens_token');
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  });
  return response.json();
};

export const upvotePost = async (id) => {
  const token = localStorage.getItem('locallens_token');
  const response = await fetch(`${BASE_URL}/posts/${id}/upvote`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to upvote');
  }
  return response.json();
};

export const deletePost = async (id) => {
  const token = localStorage.getItem('locallens_token');
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const editPost = async (id, post) => {
  const token = localStorage.getItem('locallens_token');
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  });
  return response.json();
};

export const getComments = async (postId) => {
  const response = await fetch(`${BASE_URL.replace('/api', '')}/api/comments/post/${postId}`);
  return response.json();
};

export const addComment = async (postId, text) => {
  const token = localStorage.getItem('locallens_token');
  const response = await fetch(`${BASE_URL.replace('/api', '')}/api/comments/post/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  return response.json();
};

export const confirmPost = async (id) => {
  const token = localStorage.getItem('locallens_token');
  const response = await fetch(`${BASE_URL}/posts/${id}/confirm`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to confirm');
  }
  return response.json();
};

export const denyPost = async (id) => {
  const token = localStorage.getItem('locallens_token');
  const response = await fetch(`${BASE_URL}/posts/${id}/deny`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to deny');
  }
  return response.json();
};
export const getMergedPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts/merged`);
  return response.json();
};