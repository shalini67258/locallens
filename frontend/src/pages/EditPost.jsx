import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllPosts, editPost } from '../services/postService';

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    const posts = await getAllPosts();
    const post = posts.find(p => p.id === parseInt(id));
    if (post) {
      setArea(post.area);
      setCategory(post.category);
      setContent(post.content);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await editPost(id, { area, category, content });
      navigate('/profile');
    } catch (error) {
      alert('Error updating post!');
    }
    setSaving(false);
  };

  const categories = ['Emergency', 'Traffic', 'Water', 'Event', 'General', 'Power Cut', 'Road Issue', 'Flood'];

  if (loading) return <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/profile')} className="text-cyan-400 mb-6">← Back to Profile</button>
        <h2 className="text-3xl font-black mb-6">✏️ Edit Post</h2>

        <div className="bg-white/5 border border-white/10 rounded-[35px] p-8">
          <label className="text-sm text-gray-400 font-semibold mb-2 block">📍 Area</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white mb-4 focus:outline-none focus:border-cyan-400"
          />

          <label className="text-sm text-gray-400 font-semibold mb-2 block">🏷️ Category</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${category === cat ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 border border-white/10 text-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="text-sm text-gray-400 font-semibold mb-2 block">📢 Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white h-32 resize-none mb-6 focus:outline-none focus:border-cyan-400"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-black text-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPost;