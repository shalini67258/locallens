import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'en', name: 'English', native: 'English' });
  const [langSearch, setLangSearch] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // All 22 official Indian languages
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

  // TRANSLATE using Google Translate widget
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

  // LISTEN - Text to speech
const handleListen = async () => {
    window.speechSynthesis.cancel();

    // First translate the text to selected language
    // Then speak the TRANSLATED text!
    let textToSpeak = "Your area had multiple updates today including traffic alerts, water supply issues, and local events. Stay informed and help your community!";

    // If not English, translate first then speak
    if (selectedLang.code !== 'en') {
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToSpeak)}&langpair=en|${selectedLang.code}`
        );
        const data = await res.json();
        // Use translated text for speaking!
        textToSpeak = data.responseData.translatedText;
      } catch {
        // If translation fails, speak English
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Get available voices and pick best one for selected language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v =>
      v.lang.startsWith(selectedLang.code)
    );
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.lang = selectedLang.code + '-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // STOP voice
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

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
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              🌍 LocalLens
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Hyperlocal AI Community Intelligence — All of India
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:block bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm hover:bg-white/20 transition">
              🔔 Alerts
            </button>
            <button
              onClick={() => setShowLanguages(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              🌐 {selectedLang.native}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full min-h-screen flex items-center justify-center px-6 lg:px-16 py-20">
        <div className="max-w-4xl w-full text-center">

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-5 py-2 rounded-full text-cyan-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            LIVE COMMUNITY UPDATES — YOUR CITY
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Know What's Happening
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              In Your Area
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Real-time hyperlocal alerts for power cuts, traffic,
            water issues, emergencies and local events —
            for every city and town across India. 🇮🇳
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
              📝 Post an Update
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '1.2K+', label: 'Live Updates', color: 'text-cyan-400' },
              { value: '12', label: 'Emergencies', color: 'text-red-400' },
              { value: '22', label: 'Areas Active', color: 'text-green-400' },
              { value: '98%', label: 'AI Verified', color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
                <h2 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h2>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full px-6 lg:px-16 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            Why <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">LocalLens?</span>
          </h2>
          <p className="text-gray-400 text-lg">Built for real India. Every city. Every town. Every village.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { emoji: '⚡', title: 'Real-Time Alerts', desc: 'Power cuts, water issues, traffic — know before it hits you.', onClick: () => navigate('/feed') },
            { emoji: '🤖', title: 'AI Summaries', desc: 'AI reads all updates and gives you a daily area summary.', onClick: () => navigate('/feed') },
            { emoji: '📍', title: 'Hyperlocal', desc: 'Filter by your exact area — any city, any neighborhood across India.', onClick: () => navigate('/feed') },
            { emoji: '🛡️', title: 'Trust Score', desc: 'Every post gets verified. Fake news gets flagged automatically.', onClick: null },
            { emoji: '🎙️', title: 'Voice Post', desc: 'Post updates using your voice in your language!', onClick: () => navigate('/post') },
            { emoji: '🚨', title: 'Emergency Mode', desc: 'Floods, accidents, shutdowns — instant red alerts near you.', onClick: () => navigate('/feed') },
          ].map((feature, i) => (
            <div
              key={i}
              onClick={feature.onClick}
              className={`bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:scale-105 transition ${feature.onClick ? 'cursor-pointer' : ''}`}
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI SUMMARY */}
      <section className="w-full px-6 lg:px-16 pb-20">
        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-sm text-purple-300 mb-4">
                🤖 AI GENERATED SUMMARY
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                Today's Area Summary
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Your area had multiple updates today including traffic alerts,
                water supply issues, and local events. Stay informed and
                help your community by posting real-time updates!
              </p>
            </div>
            <div className="flex gap-4 flex-wrap mt-6 lg:mt-0">
              {!isSpeaking ? (
                <button
                  onClick={handleListen}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
                >
                  🔊 Listen
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition animate-pulse"
                >
                  ⏹️ Stop
                </button>
              )}
              <button
                onClick={() => setShowLanguages(true)}
                className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold hover:bg-white/20 transition"
              >
                🌐 Translate
              </button>
            </div>
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