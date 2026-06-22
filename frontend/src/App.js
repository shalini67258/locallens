import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Feed from './pages/Feed';
import PostCreate from './pages/PostCreate';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';
import Trends from './pages/Trends';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/post" element={<PostCreate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;