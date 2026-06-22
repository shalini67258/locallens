import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMergedPosts, upvotePost, deletePost, getComments, addComment } from '../services/postService';
import { getUser, isLoggedIn } from '../services/authService';
import jsPDF from 'jspdf';
import { confirmPost, denyPost } from '../services/postService';

function Feed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState("All");
  const [search, setSearch] = useState("");
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'en', name: 'English', native: 'English' });
  const [langSearch, setLangSearch] = useState('');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openComments, setOpenComments] = useState(null);
  const [commentsData, setCommentsData] = useState({});
  const [newComment, setNewComment] = useState('');
  const [myPostsOnly, setMyPostsOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const handleConfirm = async (id) => {
  try {
    const updated = await confirmPost(id);
    setPosts(posts.map(p => p.id === id ? { ...p, confirmedCount: updated.confirmedCount } : p));
  } catch (error) {
    alert(error.message);
  }
};

const handleDeny = async (id) => {
  try {
    const updated = await denyPost(id);
    setPosts(posts.map(p => p.id === id ? { ...p, deniedCount: updated.deniedCount } : p));
  } catch (error) {
    alert(error.message);
  }
};
const getCommunityTrust = (post) => {
  const total = (post.confirmedCount || 0) + (post.deniedCount || 0);
  if (total === 0) return null;
  const ratio = post.confirmedCount / total;
  if (ratio >= 0.7) return { label: '🟢 Community Verified', color: 'text-green-400' };
  if (ratio <= 0.3) return { label: '🔴 Community Disputed', color: 'text-red-400' };
  return { label: '🟡 Mixed Reports', color: 'text-yellow-400' };
};

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  ];

  useEffect(() => {
    fetchPosts();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('emergency') === 'true') {
      setEmergencyMode(true);
    }
  }, []);

  
    const fetchPosts = async () => {
  try {
    setLoading(true);
    const data = await getMergedPosts();
    setPosts(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    setLoading(false);
  }
};

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.native.includes(langSearch)
  );

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setShowLanguages(false);
    setLangSearch('');
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang.code;
      select.dispatchEvent(new Event('change'));
    }
  };

  const toggleComments = async (postId) => {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);
    const data = await getComments(postId);
    setCommentsData(prev => ({ ...prev, [postId]: data }));
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;
    await addComment(postId, newComment);
    setNewComment('');
    const data = await getComments(postId);
    setCommentsData(prev => ({ ...prev, [postId]: data }));
  };

  const colorMap = {
    red: "from-red-500/10 to-red-500/5 border-red-500/20",
    yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
    green: "from-green-500/10 to-green-500/5 border-green-500/20",
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20"
  };

  const badgeColorMap = {
    red: "bg-red-500/20 text-red-400",
    yellow: "bg-yellow-500/20 text-yellow-300",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400"
  };

  const filteredPosts = posts.filter(post => {
    const areaMatch = selectedArea === "All" || post.area === selectedArea;
    const searchMatch = search === "" ||
      post.area.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = selectedCategory === "All" ||
      post.category === selectedCategory.replace(/[^a-zA-Z\s]/g, '').trim();
    const emergencyMatch = !emergencyMode || post.category === "Emergency";
    const myPostsMatch = !myPostsOnly || post.postedBy === getUser()?.email;
    return areaMatch && searchMatch && categoryMatch && emergencyMatch && myPostsMatch;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('LocalLens - Area Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 28);
    doc.text(`Total Updates: ${filteredPosts.length}`, 14, 34);

    let y = 45;
    filteredPosts.forEach((post, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(11);
      doc.text(`${i + 1}. [${post.category}] ${post.area}`, 14, y);
      y += 6;
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(post.content, 180);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 4;
      doc.text(`Credibility: ${post.credibility || 'Unverified'} | Upvotes: ${post.upvotes}`, 14, y);
      y += 10;
    });

    doc.save('localens-area-report.pdf');
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleUpvote = async (id) => {
  try {
    const updated = await upvotePost(id);
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: updated.upvotes } : p));
  } catch (error) {
    alert(error.message);
  }
};

  const uniqueAreas = ["All", ...new Set(posts.map(post => post.area))];
  const currentUserEmail = getUser()?.email;

  return (
    <div className="min-h-screen bg-[#030712] text-white">

      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      {/* LANGUAGE POPUP */}
      {showLanguages && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLanguages(false)}
          ></div>
          <div className="relative bg-[#0f172a] border border-white/10 rounded-[30px] p-6 w-full max-w-md mx-4 z-10 shadow-2xl">
            <h3 className="text-xl font-black mb-1">🇮🇳 Select Language</h3>
            <p className="text-gray-400 text-sm mb-4">All 22 official Indian languages</p>
            <input
              type="text"
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              placeholder="Search language..."
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition mb-4"
            />
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition flex justify-between items-center
                    ${selectedLang.code === lang.code
                      ? 'bg-cyan-500/20 border border-cyan-400/50 text-white'
                      : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                >
                  <span className="font-semibold">{lang.name}</span>
                  <span className="text-gray-400 text-sm">{lang.native}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLanguages(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center flex-wrap gap-2">
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            🌍 Live Feed
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowLanguages(true)}
              className="bg-white/10 border border-white/10 px-3 py-2 rounded-full text-sm hover:bg-white/20 transition"
            >
              🌐 {selectedLang.native}
            </button>
            <button
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                emergencyMode
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              }`}
            >
              🚨
            </button>
            {isLoggedIn() && (
              <button
                onClick={() => setMyPostsOnly(!myPostsOnly)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                  myPostsOnly
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                👤 Mine
              </button>
            )}
            <button
              onClick={() => navigate('/post')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition"
            >
              + Post
            </button>
          </div>
        </div>
      </nav>

      <div className="w-full px-6 lg:px-16 py-6">

        {/* SEARCH + EXPORT PDF */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search area, keyword or category..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
          />
          <button
            onClick={exportPDF}
            className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-sm hover:bg-white/20 transition whitespace-nowrap"
          >
            📄 Export PDF
          </button>
        </div>

        {/* EMERGENCY MODE BANNER */}
        {emergencyMode && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 mb-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-400 font-black text-lg">🚨 EMERGENCY MODE ACTIVE</h3>
                <p className="text-red-300 text-sm">Showing only emergency alerts!</p>
              </div>
              <button
                onClick={() => setEmergencyMode(false)}
                className="bg-red-500/30 text-red-300 px-4 py-2 rounded-full text-sm hover:bg-red-500/50 transition"
              >
                Exit ⬅️
              </button>
            </div>
          </div>
        )}

        {/* CATEGORY FILTER */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {['All', '🚨 Emergency', '🚧 Traffic', '💧 Water', '🎉 Event', '⚡ Power Cut', '🏗️ Road Issue', '🌊 Flood'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap font-semibold transition
                ${selectedCategory === cat
                  ? cat === '🚨 Emergency'
                    ? 'bg-red-500 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* DYNAMIC AREA FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {uniqueAreas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap font-semibold transition
                ${selectedArea === area
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
            >
              {area === "All" ? "🌍 All" : `📍 ${area}`}
            </button>
          ))}
        </div>

        <p className="text-gray-400 text-sm mb-6">
          {loading ? "Loading..." :
            filteredPosts.length === 0 ? "No updates found"
            : `Showing ${Math.min(visibleCount, filteredPosts.length)} of ${filteredPosts.length} update${filteredPosts.length > 1 ? 's' : ''}`
          }
        </p>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-spin">⚡</div>
            <p className="text-gray-400">Loading updates...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-32">
            <div className="text-7xl mb-6">📭</div>
            <h3 className="text-2xl font-black text-gray-300 mb-2">No updates yet!</h3>
            <p className="text-gray-500 mb-8">Be the first to post a local update!</p>
            <button
              onClick={() => navigate('/post')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              + Post First Update
            </button>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-400">No updates found</h3>
            <button
              onClick={() => { setSearch(""); setSelectedArea("All"); }}
              className="mt-4 bg-white/10 px-6 py-2 rounded-full text-sm hover:bg-white/20 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* REAL POST CARDS FROM DATABASE */}
        {!loading && filteredPosts.slice(0, visibleCount).map(post => (
          <div
            key={post.id}
            className={`bg-gradient-to-r ${colorMap[post.color] || colorMap.blue} border rounded-3xl p-5 mb-4 hover:scale-[1.01] transition`}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                <span className={`${badgeColorMap[post.color] || badgeColorMap.blue} px-3 py-1 rounded-full text-xs font-semibold`}>
                  {post.emoji} {post.category}
                </span>
                {post.credibility && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.credibility === 'Likely Real' ? 'bg-green-500/20 text-green-400'
                    : post.credibility === 'Less Likely' ? 'bg-yellow-500/20 text-yellow-400'
                    : post.credibility === 'Suspicious' ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {post.credibility === 'Likely Real' ? '✅ Verified Likely'
                     : post.credibility === 'Less Likely' ? '⚠️ Less Likely'
                     : post.credibility === 'Suspicious' ? '🚩 Suspicious'
                     : '❓ Unverified'}
                  </span>
                )}
                {post.severity && (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
    post.severity === 'High' ? 'bg-red-500/20 text-red-400'
    : post.severity === 'Low' ? 'bg-green-500/20 text-green-400'
    : 'bg-yellow-500/20 text-yellow-400'
  }`}>
    {post.severity === 'High' ? '🔴 High Priority'
     : post.severity === 'Low' ? '🟢 Low Priority'
     : '🟡 Medium Priority'}
  </span>
)}
              </div>
              <span className="text-gray-400 text-sm">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : ''}
              </span>
            </div>

            <p className="text-white font-semibold text-lg mt-4">
              {post.content}
            </p>
            {post.imageUrl && (
  <img
    src={`http://localhost:8080${post.imageUrl}`}
    alt="Post evidence"
    className="mt-3 rounded-2xl w-full max-h-64 object-cover border border-white/10"
  />
)}

            <div className="flex items-center mt-4">
              <div>
                <span className="text-cyan-300 text-sm">
                  📍 {post.area}
                </span>
               {post.reportedBy && (
  <div className="text-gray-500 text-xs mt-1">
    <p>👥 Reported by: {post.reportedBy.join(', ')}</p>
    {post.reportCount > 1 && (
      <p className="text-orange-400 font-semibold mt-1">
        🔁 {post.reportCount} people reported this — likely happening!
      </p>
    )}
  </div>
)}
              </div>

              <div className="ml-auto flex items-center gap-2">
                {(isLoggedIn() && post.reportedBy?.includes(currentUserEmail)) ||
 post.reportedBy?.includes('anonymous') ? (
  <button
    onClick={() => handleDelete(post.id)}
    className="bg-red-500/20 text-red-400 px-3 py-2 rounded-full hover:bg-red-500/30 transition text-xs"
  >
    🗑️ Delete
  </button>
) : null}

                <button
                  onClick={() => handleUpvote(post.id)}
                  className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition text-sm"
                >
                  👍 {post.upvotes}
                </button>
              </div>
            </div>
            {/* COMMUNITY VERIFICATION */}
<div className="mt-3 flex flex-wrap items-center gap-3">
  <button
    onClick={() => handleConfirm(post.id)}
    className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-green-500/30 transition"
  >
    👍 Confirmed ({post.confirmedCount || 0})
  </button>
  <button
    onClick={() => handleDeny(post.id)}
    className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-red-500/30 transition"
  >
    👎 Denied ({post.deniedCount || 0})
  </button>
  {getCommunityTrust(post) && (
    <span className={`text-xs font-bold ${getCommunityTrust(post).color}`}>
      {getCommunityTrust(post).label}
    </span>
  )}
</div>

            {/* COMMENTS SECTION */}
            <button
              onClick={() => toggleComments(post.id)}
              className="mt-3 text-cyan-400 text-sm hover:text-cyan-300 transition"
            >
              💬 {openComments === post.id ? 'Hide Comments' : 'View Comments'}
            </button>

            {openComments === post.id && (
              <div className="mt-3 bg-black/20 rounded-2xl p-4">

                {commentsData[post.id] && (
                  <div className="mb-3 text-sm">
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      commentsData[post.id].likelihood === 'More Likely Happened' ? 'bg-green-500/20 text-green-400'
                      : commentsData[post.id].likelihood === 'Less Likely Happened' ? 'bg-red-500/20 text-red-400'
                      : commentsData[post.id].likelihood === 'Unclear / Mixed Reports' ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {commentsData[post.id].likelihood}
                    </span>
                    <span className="text-gray-400 ml-2">
                      ({commentsData[post.id].supports} support, {commentsData[post.id].disputes} dispute)
                    </span>
                  </div>
                )}

                <div className="space-y-2 mb-3">
                  {commentsData[post.id]?.comments?.length === 0 && (
                    <p className="text-gray-500 text-sm">No comments yet. Be first!</p>
                  )}
                  {commentsData[post.id]?.comments?.map(c => (
                    <div key={c.id} className="bg-white/5 rounded-xl p-3">
                      <p className="text-white text-sm">{c.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-xs">👤 {c.commentedBy}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          c.aiVerdict === 'Supports' ? 'bg-green-500/20 text-green-400'
                          : c.aiVerdict === 'Disputes' ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {c.aiVerdict === 'Supports' ? '✅ Supports' : c.aiVerdict === 'Disputes' ? '❌ Disputes' : '⚪ Neutral'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="bg-cyan-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-cyan-600 transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* LOAD MORE - correctly placed outside the map */}
        {!loading && filteredPosts.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(visibleCount + 10)}
            className="w-full bg-white/10 hover:bg-white/20 transition py-4 rounded-2xl font-bold mt-4"
          >
            Load More ({filteredPosts.length - visibleCount} remaining)
          </button>
        )}

      </div>
    </div>
  );
}

export default Feed;