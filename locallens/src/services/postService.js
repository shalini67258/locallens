// postService.js
// This file handles ALL communication between
// React frontend and Spring Boot backend!

// Base URL of our backend
// All API calls go to this address
const BASE_URL = 'http://localhost:8080/api';

// GET ALL POSTS from database
export const getAllPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts`);
  const data = await response.json();
  return data;
};

// CREATE NEW POST - sends post to backend
export const createPost = async (post) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  });
  const data = await response.json();
  return data;
};

// UPVOTE POST
export const upvotePost = async (id) => {
  const response = await fetch(`${BASE_URL}/posts/${id}/upvote`, {
    method: 'PUT'
  });
  const data = await response.json();
  return data;
};

// DELETE POST
export const deletePost = async (id) => {
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE'
  });
};