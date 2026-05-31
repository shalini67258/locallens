import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, upvotePost, deletePost } from '../services/postService';
import { getUser, isLoggedIn } from '../services/authService';

function Feed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState("All");
  const [search, setSearch] = useState("");
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'en', name: 'English', native: 'English' });
  const [langSearch, setLangSearch] = useState('');

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

  // Runs when page loads - fetches real posts from backend!
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
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
    return areaMatch && searchMatch;
  });
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
      const updatedPost = await upvotePost(id);
      setPosts(posts.map(post =>
        post.id === id ? updatedPost : post
      ));
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  // Get unique areas from real posts for dynamic filter!
  const uniqueAreas = ["All", ...new Set(posts.map(post => post.area))];

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
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            🌍 Live Feed
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguages(true)}
              className="bg-white/10 border border-white/10 px-3 py-2 rounded-full text-sm hover:bg-white/20 transition"
            >
              🌐 {selectedLang.native}
            </button>
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

        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search area, keyword or category..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* DYNAMIC AREA FILTERS - from real posts! */}
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
            : `Showing ${filteredPosts.length} update${filteredPosts.length > 1 ? 's' : ''}`
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
        
{/* REAL POST CARDS FROM DATABASE */}

{!loading && filteredPosts.map(post => (
  <div
    key={post.id}
    className={`bg-gradient-to-r ${colorMap[post.color] || colorMap.blue} border rounded-3xl p-5 mb-4 hover:scale-[1.01] transition`}
  >
    <div className="flex justify-between items-center">
      <span className={`${badgeColorMap[post.color] || badgeColorMap.blue} px-3 py-1 rounded-full text-xs font-semibold`}>
        {post.emoji} {post.category}
      </span>
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

    <div className="flex items-center mt-4">
      <div>
        <span className="text-cyan-300 text-sm">
          📍 {post.area}
        </span>

        {post.postedBy && (
          <p className="text-gray-500 text-xs mt-1">
            👤 {post.postedBy}
          </p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {isLoggedIn() &&
          getUser()?.email === post.postedBy && (
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500/20 text-red-400 px-3 py-2 rounded-full hover:bg-red-500/30 transition text-xs"
            >
              🗑️ Delete
            </button>
          )}

        <button
          onClick={() => handleUpvote(post.id)}
          className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition text-sm"
        >
          👍 {post.upvotes}
        </button>
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
}

export default Feed;