import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, isLoggedIn, logout } from '../services/authService';

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalPosts: 0, emergencies: 0, areasActive: 0 });
  const [notifCount, setNotifCount] = useState(0);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'en', name: 'English', native: 'English' });
  const [langSearch, setLangSearch] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiSummary, setAiSummary] = useState('Loading summary...');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [showTrustScore, setShowTrustScore] = useState(false);
  const [trustData, setTrustData] = useState(null);
  const [loadingTrust, setLoadingTrust] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) setUser(getUser());
    fetchStats();
    fetchAiSummary();
    if (isLoggedIn() && getUser()?.city) fetchNotifications();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('https://locallens-backend-6p3m.onrender.com/api/posts/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const city = getUser()?.city;
      const res = await fetch(`https://locallens-backend-6p3m.onrender.com/api/posts/notifications?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setNotifCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrustScore = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    setLoadingTrust(true);
    setShowTrustScore(true);
    try {
      const token = localStorage.getItem('locallens_token');
      const res = await fetch('https://locallens-backend-6p3m.onrender.com/api/posts/trust-score', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTrustData(data);
    } catch (error) {
      console.error('Error fetching trust score:', error);
    } finally {
      setLoadingTrust(false);
    }
  };

  const fetchAiSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await fetch('https://locallens-backend-6p3m.onrender.com/api/posts/summary');
      const data = await res.json();
      setAiSummary(data.summary);
    } catch (error) {
      setAiSummary('Unable to load summary. Make sure backend is running!');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowMenu(false);
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

  const handleListen = async () => {
    window.speechSynthesis.cancel();
    let textToSpeak = aiSummary;
    if (selectedLang.code !== 'en') {
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToSpeak)}&langpair=en|${selectedLang.code}`
        );
        const data = await res.json();
        textToSpeak = data.responseData.translatedText;
      } catch {}
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(selectedLang.code));
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.lang = selectedLang.code + '-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* LANGUAGE POPUP */}
      {showLanguages && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLanguages(false)}></div>
          <div className="relative bg-[#0f172a] border border-white/10 rounded-[30px] p-6 w-full max-w-md mx-4 z-10 shadow-2xl">
            <h3 className="text-xl font-black mb-1">🇮🇳 Choose your language</h3>
            <p className="text-gray-400 text-sm mb-4">Read and hear LocalLens in any of 22 Indian languages</p>
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
            <button onClick={() => setShowLanguages(false)} className="w-full mt-4 py-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* TRUST SCORE POPUP */}
      {showTrustScore && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowTrustScore(false)}></div>
          <div className="relative bg-[#0f172a] border border-white/10 rounded-[30px] p-8 w-full max-w-md mx-4 z-10 shadow-2xl text-center">
            {loadingTrust ? (
              <p className="text-gray-400">Calculating your trust score...</p>
            ) : trustData?.error ? (
              <div>
                <div className="text-5xl mb-4">🔒</div>
                <p className="text-gray-400">{trustData.error}</p>
                <button onClick={() => navigate('/login')} className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-2xl font-bold">
                  Login
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black mb-1">🛡️ Your Trust Score</h3>
                <p className="text-gray-400 text-sm mb-6">Based on your real activity</p>
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke="#06b6d4" strokeWidth="8"
                      strokeDasharray={`${(trustData?.score || 0) * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-cyan-400">{trustData?.score || 0}</span>
                  </div>
                </div>
                <p className="text-lg font-bold mb-4">{trustData?.badge}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-2xl font-black text-cyan-400">{trustData?.totalPosts || 0}</p>
                    <p className="text-gray-400 text-sm">Posts Made</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-2xl font-black text-purple-400">{trustData?.totalUpvotes || 0}</p>
                    <p className="text-gray-400 text-sm">Upvotes Received</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs">Post more updates and get upvotes to increase your score!</p>
              </>
            )}
            <button onClick={() => setShowTrustScore(false)} className="w-full mt-4 py-3 rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              🌍 LocalLens
            </h1>
            <p className="text-gray-400 text-xs mt-1 hidden sm:block">
              Hyperlocal AI Community Intelligence — All of India
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => setShowLanguages(true)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 px-3 py-2 rounded-full text-sm transition group"
              title="Click to change language"
            >
              <span className="text-cyan-400">🌐</span>
              <span className="hidden sm:block text-gray-300 group-hover:text-white">{selectedLang.native}</span>
              <span className="hidden md:block text-gray-500 text-xs">▾ change</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-cyan-400/50 pl-2 pr-3 py-1.5 rounded-full transition"
                >
                  <span className="relative w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-black">
                    {user.name?.charAt(0).toUpperCase()}
                    {notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {notifCount}
                      </span>
                    )}
                  </span>
                  <span className="hidden md:block text-sm text-gray-300">{user.name}</span>
                  <span className="text-gray-500 text-xs">▾</span>
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                      <button onClick={() => { setShowMenu(false); navigate('/profile'); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition flex items-center gap-2">
                        👤 My Profile
                      </button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition flex items-center gap-2 border-t border-white/10">
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
              >
                🔐 Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full min-h-screen flex items-center justify-center px-6 lg:px-16 py-20">
        <div className="max-w-4xl w-full text-center">

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-5 py-2 rounded-full text-cyan-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            LIVE COMMUNITY INTELLIGENCE — YOUR CITY, IN REAL TIME
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Know What's Happening
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              In Your Area
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            A crowd-verified, AI-powered alert network for power cuts, water issues, traffic,
            emergencies and local events — built for every city, town and neighborhood across India. 🇮🇳
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/feed')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/30 hover:scale-105 transition"
            >
              🚀 Explore Live Feed
            </button>
            <button
              onClick={() => navigate('/post')}
              className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition"
            >
              📝 Report an Update
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-cyan-400">{stats.totalPosts || 0}</h2>
              <p className="text-gray-400 text-sm mt-1">Live Updates</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-red-400">{stats.emergencies || 0}</h2>
              <p className="text-gray-400 text-sm mt-1">Emergencies</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-green-400">{stats.areasActive || 0}</h2>
              <p className="text-gray-400 text-sm mt-1">Areas Active</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-purple-400">{stats.totalPosts > 0 ? '98%' : '0%'}</h2>
              <p className="text-gray-400 text-sm mt-1">AI Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - Real-Time Alerts removed, Gov Dashboard + Trends added */}
      <section className="w-full px-6 lg:px-16 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            Why <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">LocalLens?</span>
          </h2>
          <p className="text-gray-400 text-lg">One platform. Every street. Real people keeping each other informed.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { emoji: '🤖', title: 'AI Summaries', desc: 'AI reads every update and writes you a daily summary of your area.', onClick: () => document.getElementById('ai-summary-section').scrollIntoView({ behavior: 'smooth' }) },
            { emoji: '📍', title: 'Hyperlocal', desc: 'Filter by your exact street or neighborhood — anywhere in India.', onClick: () => navigate('/feed') },
            { emoji: '🛡️', title: 'Trust Score', desc: 'Every post is AI-checked and community-verified. Fake reports get flagged.', onClick: fetchTrustScore },
            { emoji: '🎙️', title: 'Voice Post', desc: 'Speak your update in any Indian language — we convert it to text instantly.', onClick: () => navigate('/post') },
            { emoji: '🚨', title: 'Emergency Mode', desc: 'Floods, fires, accidents — switch to red-alert mode for critical updates only.', onClick: () => navigate('/feed?emergency=true') },
            { emoji: '🏛️', title: 'Government Dashboard', desc: 'Live municipal-style analytics — complaint volume, hotspots, and trends.', onClick: () => navigate('/dashboard') },
            { emoji: '📊', title: 'Area Trends', desc: 'Visual charts of what\'s happening most, and where, across your city.', onClick: () => navigate('/trends') },
          ].map((feature, i) => (
            <div
              key={i}
              onClick={feature.onClick}
              className={`bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:border-cyan-400/30 hover:scale-105 transition ${feature.onClick ? 'cursor-pointer' : ''}`}
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI SUMMARY */}
      <section id="ai-summary-section" className="w-full px-6 lg:px-16 pb-20">
        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-sm text-purple-300 mb-4">
            🤖 AI GENERATED SUMMARY
          </div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
            Today's Area Summary
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {loadingSummary ? '🤖 AI is analyzing your community updates...' : aiSummary}
          </p>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            {!isSpeaking ? (
              <button
                onClick={handleListen}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 rounded-full font-semibold text-sm hover:scale-105 transition"
              >
                🔊 Listen to this summary
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 rounded-full font-semibold text-sm hover:scale-105 transition animate-pulse"
              >
                ⏹️ Stop speaking
              </button>
            )}
            <button
              onClick={fetchAiSummary}
              className="flex items-center gap-2 bg-white/10 border border-white/10 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white/20 transition"
            >
              🔄 Get latest summary
            </button>
            <button
              onClick={() => setShowLanguages(true)}
              className="flex items-center gap-2 bg-white/10 border border-white/10 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-white/20 transition"
            >
              🌐 Read in another language
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-6 lg:px-16 py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        🌍 LocalLens — Built for Every Indian City, Powered by AI
      </footer>

    </div>
  );
}

export default Home;