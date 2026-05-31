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
  const response = await fetch(`${BASE_URL}/posts/${id}/upvote`, {
    method: 'PUT'
  });
  return response.json();
};

export const deletePost = async (id) => {
  const token = localStorage.getItem('locallens_token');
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};