import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/postService';

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllPosts();
    setPosts(data);
    setLoading(false);
  };

  // Calculate stats
  const today = new Date().toDateString();
  const todayPosts = posts.filter(p =>
    p.createdAt && new Date(p.createdAt).toDateString() === today
  );

  const categoryCounts = {};
  posts.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const areaCounts = {};
  posts.forEach(p => {
    areaCounts[p.area] = (areaCounts[p.area] || 0) + 1;
  });

  const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0];
  const emergencyCount = posts.filter(p => p.category === 'Emergency' || p.category === 'Flood').length;
  const verifiedCount = posts.filter(p => p.credibility === 'Likely Real').length;
  const verifiedPercent = posts.length > 0 ? Math.round((verifiedCount / posts.length) * 100) : 0;

  const categoryIcons = {
    Emergency: '🚨',
    Traffic: '🚧',
    Water: '💧',
    Event: '🎉',
    General: '📢',
    'Power Cut': '⚡',
    'Road Issue': '🏗️',
    Flood: '🌊'
  };

  if (loading) return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
      <div className="text-6xl animate-spin">⚡</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-cyan-400 hover:text-cyan-300 font-bold transition">← Back</button>
          <div className="text-center">
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              🏛️ Government Dashboard
            </h1>
            <p className="text-gray-400 text-xs">Municipal Intelligence Portal</p>
          </div>
          <div className="text-xs text-gray-400">
            🔴 LIVE • {new Date().toLocaleString('en-IN')}
          </div>
        </div>
      </nav>

      <div className="w-full px-6 lg:px-16 py-8">

        {/* TOP STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <p className="text-4xl font-black text-cyan-400">{posts.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total Reports</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <p className="text-4xl font-black text-yellow-400">{todayPosts.length}</p>
            <p className="text-gray-400 text-sm mt-1">Reports Today</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 text-center">
            <p className="text-4xl font-black text-red-400">{emergencyCount}</p>
            <p className="text-gray-400 text-sm mt-1">🚨 Emergencies</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 text-center">
            <p className="text-4xl font-black text-green-400">{verifiedPercent}%</p>
            <p className="text-gray-400 text-sm mt-1">✅ AI Verified</p>
          </div>
        </div>

        {/* MOST AFFECTED AREA */}
        {topArea && (
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎯</div>
              <div>
                <p className="text-gray-400 text-sm">Most Affected Area</p>
                <h2 className="text-3xl font-black text-white">{topArea[0]}</h2>
                <p className="text-red-400 text-sm">{topArea[1]} reports need attention</p>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY BREAKDOWN */}
        <h2 className="text-xl font-black mb-4">📊 Reports by Category</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => (
              <div key={category} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">
                    {categoryIcons[category] || '📢'} {category}
                  </span>
                  <span className="text-cyan-400 font-black">{count}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (count / posts.length) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>

        {/* AREA BREAKDOWN */}
        <h2 className="text-xl font-black mb-4">📍 Reports by Area</h2>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
          {Object.entries(areaCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([area, count], i) => (
              <div key={area} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-6">#{i + 1}</span>
                  <span className="font-semibold">📍 {area}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (count / topArea[1]) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-cyan-400 font-black w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
        </div>

        {/* RECENT EMERGENCY POSTS */}
        <h2 className="text-xl font-black mb-4">🚨 Recent Emergency Reports</h2>
        <div className="space-y-3">
          {posts
            .filter(p => p.category === 'Emergency' || p.category === 'Flood')
            .slice(0, 5)
            .map(post => (
              <div key={post.id} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-red-400 text-xs font-bold">🚨 {post.category}</span>
                    <p className="text-white font-semibold mt-1">{post.content}</p>
                    <p className="text-gray-400 text-xs mt-1">📍 {post.area} • 👤 {post.postedBy}</p>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {post.createdAt ? new Date(post.createdAt).toLocaleString('en-IN') : ''}
                  </span>
                </div>
              </div>
            ))}
          {posts.filter(p => p.category === 'Emergency' || p.category === 'Flood').length === 0 && (
            <p className="text-gray-500 text-center py-8">No emergency reports at this time ✅</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          🏛️ LocalLens Municipal Intelligence Portal • Data updates in real-time
        </div>
      </div>
    </div>
  );
}

export default Dashboard;