import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, isLoggedIn, logout } from '../services/authService';
import { getAllPosts, deletePost, upvotePost } from '../services/postService';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);
const [editingCity, setEditingCity] = useState(false);
const [cityInput, setCityInput] = useState('');

const [photoPreview, setPhotoPreview] = useState(localStorage.getItem('locallens_photo') || null);
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    setUser(getUser());
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const currentUser = getUser();
      const allPosts = await getAllPosts();
      setMyPosts(allPosts.filter(p => p.postedBy === currentUser.email));

      const token = localStorage.getItem('locallens_token');
      const res = await fetch('https://locallens-backend-6p3m.onrender.com/api/posts/trust-score', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTrustData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setMyPosts(myPosts.filter(p => p.id !== id));
  };
const saveCity = () => {
  const updatedUser = { ...user, city: cityInput };
  localStorage.setItem('locallens_user', JSON.stringify(updatedUser));
  setUser(updatedUser);
  setEditingCity(false);
};
  const handleUpvote = async (id) => {
    const updated = await upvotePost(id);
    setMyPosts(myPosts.map(p => p.id === id ? updated : p));
  };
  const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    setPhotoPreview(reader.result);
    localStorage.setItem('locallens_photo', reader.result);
  };
  reader.readAsDataURL(file);
};

  const colorMap = {
    red: "from-red-500/10 to-red-500/5 border-red-500/20",
    yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
    green: "from-green-500/10 to-green-500/5 border-green-500/20",
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20"
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-cyan-400 hover:text-cyan-300 font-bold transition">← Back</button>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">👤 My Profile</h1>
          <button onClick={() => { logout(); navigate('/'); }} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm hover:bg-red-500/30 transition">Logout</button>
        </div>
      </nav>

      <div className="w-full px-6 lg:px-16 py-8">

       {/* PROFILE CARD */}
<div className="bg-white/5 border border-white/10 rounded-[35px] p-8 mb-8 backdrop-blur-xl">
  <div className="flex flex-wrap items-center gap-6">

    {/* PROFILE PHOTO */}
    <div className="relative">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black overflow-hidden">
        {photoPreview ? (
          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          user.name?.charAt(0).toUpperCase()
        )}
      </div>
      <label className="absolute bottom-0 right-0 bg-cyan-500 rounded-full w-7 h-7 flex items-center justify-center text-xs cursor-pointer hover:bg-cyan-600 transition">
        📷
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
      </label>
    </div>

    <div className="flex-1">
      <h2 className="text-2xl font-black">{user.name}</h2>
      <p className="text-gray-400">{user.email}</p>

      <div className="flex items-center gap-2 mt-1">
        {editingCity ? (
          <>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter your city"
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            <button onClick={saveCity} className="text-cyan-400 text-sm font-bold">Save</button>
          </>
        ) : (
          <>
            <p className="text-cyan-400 text-sm">📍 {user.city || 'Location not set'}</p>
            <button onClick={() => { setEditingCity(true); setCityInput(user.city || ''); }} className="text-gray-400 text-xs hover:text-white">✏️ edit</button>
          </>
        )}
      </div>
    </div>

    {trustData && !trustData.error && (
      <div className="bg-white/5 rounded-2xl p-4 text-center">
        <p className="text-3xl font-black text-cyan-400">{trustData.score}</p>
        <p className="text-gray-400 text-xs">{trustData.badge}</p>
      </div>
    )}
  </div>
</div>

        {/* MY POSTS */}
        <h3 className="text-xl font-black mb-4">📝 My Posts ({myPosts.length})</h3>

        {loading && <p className="text-gray-400">Loading...</p>}

        {!loading && myPosts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>You haven't posted anything yet!</p>
            <button onClick={() => navigate('/post')} className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-2xl font-bold">+ Post Update</button>
          </div>
        )}

        {myPosts.map(post => (
          <div key={post.id} className={`bg-gradient-to-r ${colorMap[post.color] || colorMap.blue} border rounded-3xl p-5 mb-4`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold">{post.emoji} {post.category}</span>
              <span className="text-gray-400 text-xs">
                {post.createdAt ? new Date(post.createdAt).toLocaleString('en-IN') : ''}
              </span>
            </div>
            <p className="text-white mb-3">{post.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-cyan-300 text-sm">📍 {post.area}</span>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/edit/${post.id}`)} className="bg-white/10 px-3 py-2 rounded-full text-xs hover:bg-white/20 transition">✏️ Edit</button>
                <button onClick={() => handleDelete(post.id)} className="bg-red-500/20 text-red-400 px-3 py-2 rounded-full text-xs hover:bg-red-500/30 transition">🗑️ Delete</button>
                <button onClick={() => handleUpvote(post.id)} className="bg-white/10 px-3 py-2 rounded-full text-xs hover:bg-white/20 transition">👍 {post.upvotes}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;{/* PROFILE CARD */}