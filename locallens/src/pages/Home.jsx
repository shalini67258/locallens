// Home.jsx - Landing page of LocalLens
// Clean, beautiful, full screen dark UI

import { useNavigate } from 'react-router-dom';

function Home() {

  // useNavigate = move between pages without refresh
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* ===== ANIMATED BACKGROUND BLOBS ===== */}
      {/* These are just colored blurred circles */}
      {/* They create the glow effect behind everything */}
      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* ===== NAVBAR ===== */}
      {/* sticky top-0 = stays at top when you scroll */}
      {/* backdrop-blur = glass effect */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              🌍 LocalLens
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Hyperlocal AI-Powered City Intelligence
            </p>
          </div>

          {/* NAV BUTTONS */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm hover:bg-white/20 transition">
              🔔 Alerts
            </button>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition">
              తెలుగు / EN
            </button>
          </div>

        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      {/* Full screen height, centered content */}
      <section className="w-full min-h-screen flex items-center justify-center px-6 lg:px-16 py-20">

        <div className="max-w-4xl w-full text-center">

          {/* LIVE BADGE */}
          {/* animate-pulse makes it blink slowly */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-5 py-2 rounded-full text-cyan-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            LIVE CITY UPDATES — HYDERABAD
          </div>

          {/* MAIN HEADING */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Know Your
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              City Instantly
            </span>
          </h1>

          {/* SUBHEADING */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Real-time hyperlocal alerts for power cuts, traffic,
            water issues, emergencies and local events —
            AI-summarized in Telugu & English.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">

            {/* Main button - goes to Feed page */}
            <button
              onClick={() => navigate('/feed')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/30 hover:scale-105 transition"
            >
              🚀 Explore Live Feed
            </button>

            {/* Secondary button - goes to Post Create page */}
            <button
              onClick={() => navigate('/post')}
              className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition"
            >
              📝 Post an Update
            </button>

          </div>

          {/* STATS GRID */}
          {/* 4 boxes showing app statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-cyan-400">1.2K+</h2>
              <p className="text-gray-400 text-sm mt-1">Live Updates</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-red-400">12</h2>
              <p className="text-gray-400 text-sm mt-1">Emergencies</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-green-400">22</h2>
              <p className="text-gray-400 text-sm mt-1">Areas Active</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:bg-white/10 transition">
              <h2 className="text-3xl font-black text-purple-400">98%</h2>
              <p className="text-gray-400 text-sm mt-1">AI Verified</p>
            </div>

          </div>

        </div>

      </section>

      {/* ===== FEATURES SECTION ===== */}
      {/* Shows what the app can do */}
      <section className="w-full px-6 lg:px-16 py-20">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            Why <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">LocalLens?</span>
          </h2>
          <p className="text-gray-400 text-lg">Built for real India. Built for real problems.</p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:scale-105 transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Alerts</h3>
            <p className="text-gray-400">Power cuts, water issues, traffic — know before it hits you.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:scale-105 transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Summaries</h3>
            <p className="text-gray-400">AI reads all updates and gives you a daily city summary in Telugu & English.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:scale-105 transition">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-2">Hyperlocal</h3>
            <p className="text-gray-400">Filter by your exact area — Kukatpally, Miyapur, Hitech City and more.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:scale-105 transition">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Trust Score</h3>
            <p className="text-gray-400">Every post gets verified. Fake news gets flagged automatically.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:scale-105 transition">
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-bold mb-2">Voice in Telugu</h3>
            <p className="text-gray-400">Post updates using your voice in Telugu. No typing needed!</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/10 hover:scale-105 transition">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-bold mb-2">Emergency Mode</h3>
            <p className="text-gray-400">Floods, accidents, shutdowns — instant red alerts to your area.</p>
          </div>

        </div>

      </section>

      {/* ===== AI SUMMARY SECTION ===== */}
      <section className="w-full px-6 lg:px-16 pb-20">

        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto">

          <div className="flex flex-wrap items-center gap-4 justify-between">

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full text-sm text-purple-300 mb-4">
                🤖 AI GENERATED SUMMARY
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                Today's Hyderabad Summary
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Hyderabad experienced 12 traffic alerts, 4 water supply issues,
                and 2 major power cuts today. Hitech City remains the busiest
                zone while Kukatpally reported the highest emergency activity.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap mt-6 lg:mt-0">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition">
                🔊 Listen in Telugu
              </button>
              <button className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold hover:bg-white/20 transition">
                🌐 Translate
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ===== FOOTER ===== */}
      <footer className="w-full px-6 lg:px-16 py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        🌍 LocalLens — Built for Hyderabad, Powered by AI
      </footer>

    </div>
  );
}

export default Home;