import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCreate() {
  const navigate = useNavigate();

  const now = new Date();
  const timePosted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const datePosted = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const [area, setArea] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const suggestions = {
    Emergency: [
      'Major power cut in this area, no electricity since morning!',
      'Road accident near main junction, traffic blocked!',
      'Building fire reported, residents please evacuate!',
      'Gas leak smell detected near colony gate!',
    ],
    Traffic: [
      'Heavy traffic jam near metro station, avoid if possible!',
      'Road under repair, use alternate route!',
      'Signal not working at main crossing!',
      'Waterlogging on main road causing traffic slowdown!',
    ],
    Water: [
      'No water supply since morning, please arrange!',
      'Water supply will be disrupted tomorrow 6AM to 12PM!',
      'Dirty water coming from taps, please check!',
      'Water leakage on main road, wastage happening!',
    ],
    Event: [
      'Free health checkup camp tomorrow at community hall!',
      'Local food festival this weekend, everyone welcome!',
      'Cricket tournament starting Sunday at ground!',
      'Cultural program tonight at colony park!',
    ],
    'Power Cut': [
      'Power cut from 10AM to 2PM today for maintenance!',
      'Unexpected power cut since 3 hours, no update from TSECPDL!',
      'Frequent power cuts happening past 3 days!',
      'Transformer issue causing power fluctuation!',
    ],
    'Road Issue': [
      'Big pothole on main road, vehicles getting damaged!',
      'Road digging started, no diversion provided!',
      'Street lights not working since 1 week!',
      'Footpath blocked by construction material!',
    ],
    Flood: [
      'Heavy waterlogging in colony after rain!',
      'Drain overflowing onto road, dangerous for vehicles!',
      'Underground drainage blocked, water entering homes!',
      'Low lying area flooded, residents need help!',
    ],
    General: [
      'Stray dogs causing trouble near park, please take action!',
      'Garbage not collected since 3 days, smell unbearable!',
      'Street vendor blocking footpath near school!',
      'Illegal parking causing issues near hospital!',
    ],
  };

  // SEARCH REAL PLACES using OpenStreetMap
  // Free! No API key! Works for all India!
  const handleLocationSearch = async (value) => {
    setLocationSearch(value);
    setArea(value);

    if (value.length > 2) {
      setLoadingLocations(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&countrycodes=in&format=json&limit=6&addressdetails=1`
        );
        const data = await res.json();
        setLocationSuggestions(data);
      } catch {
        setLocationSuggestions([]);
      }
      setLoadingLocations(false);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSubmit = () => {
    if (!area || !content || !category) {
      alert('Please fill area, category and update!');
      return;
    }

    const newPost = {
      id: Date.now(),
      area: area,
      category: category,
      content: content,
      time: timePosted + ' • ' + datePosted,
      upvotes: 0,
      color: category === 'Emergency' || category === 'Flood' ? 'red'
           : category === 'Traffic' || category === 'Road Issue' ? 'yellow'
           : category === 'Event' ? 'green'
           : 'blue',
      emoji: category === 'Emergency' ? '🚨'
           : category === 'Traffic' ? '🚧'
           : category === 'Water' ? '💧'
           : category === 'Event' ? '🎉'
           : category === 'Power Cut' ? '⚡'
           : category === 'Road Issue' ? '🏗️'
           : category === 'Flood' ? '🌊'
           : 'ℹ️'
    };

    const existingPosts = JSON.parse(
      localStorage.getItem('locallens_posts') || '[]'
    );
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('locallens_posts', JSON.stringify(updatedPosts));

    setSubmitted(true);
    setTimeout(() => navigate('/feed'), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-4xl font-black mb-4">Update Posted!</h2>
          <p className="text-gray-400 text-lg">Taking you to feed...</p>
          <p className="text-gray-500 text-sm mt-2">Posted at {timePosted}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white">

      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10">
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition"
          >
            ← Back
          </button>
          <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            📝 Post an Update
          </h1>
          <div className="text-right">
            <p className="text-cyan-400 text-sm font-bold">{timePosted}</p>
            <p className="text-gray-500 text-xs">{datePosted}</p>
          </div>
        </div>
      </nav>

      <div className="w-full px-6 lg:px-16 py-10">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT - FORM */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-xl">

            <h2 className="text-3xl font-black mb-2">Share What's Happening</h2>
            <p className="text-gray-400 mb-8">Help your neighbors stay informed! 🌍</p>

            {/* AREA WITH REAL LOCATION SEARCH */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 font-semibold mb-2 block">
                📍 Your Area
              </label>

              {/* Quick area buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {['Kukatpally', 'Miyapur', 'Hitech City', 'Dilsukhnagar', 'Madhapur', 'Gachibowli'].map(a => (
                  <button
                    key={a}
                    onClick={() => {
                      setArea(a);
                      setLocationSearch(a);
                      setLocationSuggestions([]);
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition
                      ${area === a
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                  >
                    📍 {a}
                  </button>
                ))}
              </div>

              {/* Location search with real suggestions */}
              <div className="relative">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  placeholder="🔍 Search any city or area in India..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />

                {/* Loading */}
                {loadingLocations && (
                  <div className="absolute right-4 top-3 text-cyan-400 text-sm animate-pulse">
                    Searching...
                  </div>
                )}

                {/* Suggestions dropdown */}
                {locationSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {locationSuggestions.map((place, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Get short readable name
                          const shortName = place.display_name.split(',')[0];
                          setArea(shortName);
                          setLocationSearch(shortName);
                          setLocationSuggestions([]);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/10 transition border-b border-white/5 last:border-0"
                      >
                        <p className="text-white text-sm font-semibold">
                          📍 {place.display_name.split(',')[0]}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {place.display_name.split(',').slice(1, 3).join(',')}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Show selected area */}
              {area && (
                <p className="text-cyan-400 text-xs mt-2">
                  ✅ Selected: {area}
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 font-semibold mb-2 block">
                🏷️ Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: '🚨 Emergency', value: 'Emergency' },
                  { label: '🚧 Traffic', value: 'Traffic' },
                  { label: '💧 Water', value: 'Water' },
                  { label: '🎉 Event', value: 'Event' },
                  { label: 'ℹ️ General', value: 'General' },
                  { label: '⚡ Power Cut', value: 'Power Cut' },
                  { label: '🏗️ Road Issue', value: 'Road Issue' },
                  { label: '🌊 Flood', value: 'Flood' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setCategory(cat.value);
                      setContent('');
                    }}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition
                      ${category === cat.value
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 font-semibold mb-2 block">
                📢 What's Happening?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the situation or click a suggestion →"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition h-32 resize-none"
              />
              <p className="text-gray-500 text-xs mt-1 text-right">
                {content.length}/300
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-cyan-500/30 hover:scale-105 transition"
            >
              🚀 Post Update
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-3 py-3 rounded-2xl font-semibold text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>

          </div>

          {/* RIGHT - SUGGESTIONS */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-xl">

            <h2 className="text-2xl font-black mb-2">⚡ Quick Suggestions</h2>

            {!category ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-gray-400 text-lg">Select a category first</p>
                  <p className="text-gray-500 text-sm mt-2">Suggestions will appear here!</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-6">Click any suggestion to auto-fill!</p>
                <div className="space-y-3">
                  {suggestions[category].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setContent(suggestion)}
                      className={`w-full text-left p-4 rounded-2xl border transition
                        ${content === suggestion
                          ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                      <span className="text-cyan-400 font-bold mr-2">{index + 1}.</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-2xl border border-dashed border-white/20 text-center text-gray-400 text-sm">
                  ✏️ Or type your own update in the text box
                </div>
              </div>
            )}

            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400 text-sm font-semibold mb-1">🕐 Auto Timestamp</p>
              <p className="text-white font-bold">{timePosted} • {datePosted}</p>
              <p className="text-gray-500 text-xs mt-1">Time added automatically!</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCreate;