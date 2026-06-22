import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';

function PostCreate() {
  const navigate = useNavigate();
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [translating, setTranslating] = useState(false);

  const now = new Date();
  const timePosted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const datePosted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

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
      'Medical emergency, ambulance needed urgently!',
      'Building collapse reported, please avoid the area!',
    ],
    Traffic: [
      'Heavy traffic jam near metro station, avoid if possible!',
      'Road under repair, use alternate route!',
      'Signal not working at main crossing!',
      'Waterlogging on main road causing traffic slowdown!',
      'VIP movement causing traffic diversion!',
      'Vehicle breakdown blocking one lane!',
    ],
    Water: [
      'No water supply since morning, please arrange!',
      'Water supply will be disrupted tomorrow 6AM to 12PM!',
      'Dirty water coming from taps, please check!',
      'Water leakage on main road, wastage happening!',
      'Water tanker not arrived as scheduled!',
      'Low water pressure since 2 days!',
    ],
    Event: [
      'Free health checkup camp tomorrow at community hall!',
      'Local food festival this weekend, everyone welcome!',
      'Cricket tournament starting Sunday at ground!',
      'Cultural program tonight at colony park!',
      'Blood donation camp organized this Saturday!',
      'Diwali mela starting next week at main ground!',
    ],
    'Power Cut': [
      'Power cut from 10AM to 2PM today for maintenance!',
      'Unexpected power cut since 3 hours, no update from TSSPDCL!',
      'Frequent power cuts happening past 3 days!',
      'Transformer issue causing power fluctuation!',
      'Scheduled power shutdown tomorrow for line work!',
      'Voltage fluctuation damaging appliances!',
    ],
    'Road Issue': [
      'Big pothole on main road, vehicles getting damaged!',
      'Road digging started, no diversion provided!',
      'Street lights not working since 1 week!',
      'Footpath blocked by construction material!',
      'Road completely waterlogged after rain!',
      'Speed breaker missing warning sign, accident risk!',
    ],
    Flood: [
      'Heavy waterlogging in colony after rain!',
      'Drain overflowing onto road, dangerous for vehicles!',
      'Underground drainage blocked, water entering homes!',
      'Low lying area flooded, residents need help!',
      'River water level rising, nearby homes at risk!',
      'Stormwater drain collapsed, road caved in!',
    ],
    Theft: [
      'Chain snatching reported near this area, stay alert!',
      'House break-in attempt last night, be cautious!',
      'Vehicle theft reported in this locality!',
      'Suspicious individuals loitering near homes!',
    ],
    Health: [
      'Dengue cases rising, please clear stagnant water!',
      'Mosquito fogging needed urgently in this area!',
      'Stray dog bite incidents increasing!',
      'Garbage causing health hazard, needs collection!',
    ],
    General: [
      'Stray dogs causing trouble near park, please take action!',
      'Garbage not collected since 3 days, smell unbearable!',
      'Street vendor blocking footpath near school!',
      'Illegal parking causing issues near hospital!',
      'Noise pollution from construction at night!',
      'Public toilet needs urgent cleaning!',
    ],
  };

  // FREE OpenStreetMap search - real places anywhere in India
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // VOICE POST - fixed version with proper error handling
  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice not supported in this browser! Please use Google Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    // Request microphone permission explicitly first
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => {
        startRecognition(SpeechRecognition);
      })
      .catch(() => {
        alert('Microphone access denied! Please allow microphone permission in your browser settings (click the 🔒 icon next to the URL bar).');
      });
  };

  const startRecognition = (SpeechRecognition) => {
    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setIsListening(false);

      const langCode = voiceLang.split('-')[0];
      if (langCode !== 'en') {
        setTranslating(true);
        try {
          const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(spokenText)}&langpair=${langCode}|en`
          );
          const data = await res.json();
          setContent(data.responseData.translatedText);
        } catch {
          setContent(spokenText);
        } finally {
          setTranslating(false);
        }
      } else {
        setContent(spokenText);
      }
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'no-speech') {
        alert('No speech detected. Please speak clearly right after clicking the mic!');
      } else if (e.error === 'audio-capture') {
        alert('No microphone found on this device!');
      } else if (e.error === 'not-allowed') {
        alert('Microphone permission blocked. Click the 🔒 or 🎙️ icon in your browser address bar and allow microphone access, then try again!');
      } else if (e.error === 'network') {
        alert('Network error. Voice recognition needs an internet connection!');
      } else {
        alert('Could not hear clearly! Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      setIsListening(false);
      alert('Voice recognition already running. Please wait a moment and try again.');
    }
  };

  const handleSubmit = async () => {
    if (!area || !category || !content) {
      alert('Please fill area, category and content!');
      return;
    }
    try {
      const newPost = await createPost({ area, category, content });

      if (selectedImage && newPost.id) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        await fetch(`https://locallens-backend-6p3m.onrender.com/api/posts/${newPost.id}/image`, {
          method: 'POST',
          body: formData
        });
      }

      setSubmitted(true);
      setTimeout(() => navigate('/feed'), 2000);
    } catch (error) {
      alert('Error! Make sure backend is running on port 8080!');
    }
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
          <button onClick={() => navigate('/')} className="text-cyan-400 hover:text-cyan-300 font-bold transition">
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

      {/* SINGLE FLOWING LAYOUT - no left/right box split */}
      <div className="w-full px-6 lg:px-16 py-10 max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2">Share What's Happening 🌍</h2>
          <p className="text-gray-400">Help your neighbors stay informed, in real time</p>
        </div>

        {/* STEP 1 - AREA */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">1</span>
            <label className="text-sm text-gray-300 font-semibold">Where is this happening?</label>
          </div>
          <div className="relative">
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => handleLocationSearch(e.target.value)}
              placeholder="Type your area — e.g. Jagathgirigutta, Hyderabad, Telangana"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
            {loadingLocations && (
              <div className="absolute right-4 top-4 text-cyan-400 text-sm animate-pulse">
                Searching...
              </div>
            )}
            {locationSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto">
                {locationSuggestions.map((place, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setArea(place.display_name);
                      setLocationSearch(place.display_name);
                      setLocationSuggestions([]);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/10 transition border-b border-white/5 last:border-0"
                  >
                    <p className="text-white text-sm font-semibold">
                      📍 {place.display_name.split(',')[0]}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {place.display_name.split(',').slice(1, 4).join(',')}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {area && !locationSuggestions.length && (
            <p className="text-cyan-400 text-xs mt-2">✅ {area}</p>
          )}
        </div>

        {/* STEP 2 - CATEGORY */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">2</span>
            <label className="text-sm text-gray-300 font-semibold">What kind of update is it?</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '🚨 Emergency', value: 'Emergency' },
              { label: '🚧 Traffic', value: 'Traffic' },
              { label: '💧 Water', value: 'Water' },
              { label: '🎉 Event', value: 'Event' },
              { label: '⚡ Power Cut', value: 'Power Cut' },
              { label: '🏗️ Road Issue', value: 'Road Issue' },
              { label: '🌊 Flood', value: 'Flood' },
              { label: '🚔 Theft', value: 'Theft' },
              { label: '🏥 Health', value: 'Health' },
              { label: 'ℹ️ General', value: 'General' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setCategory(cat.value); setContent(''); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
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

        {/* STEP 2.5 - SUGGESTIONS (inline, appears below category, not a separate box) */}
        {category && (
          <div className="mb-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4">
            <p className="text-cyan-400 text-xs font-semibold mb-3">⚡ Quick suggestions — tap to use</p>
            <div className="flex flex-wrap gap-2">
              {suggestions[category].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setContent(suggestion)}
                  className={`text-left px-3 py-2 rounded-xl text-xs transition max-w-xs
                    ${content === suggestion
                      ? 'bg-cyan-500/30 border border-cyan-400/50 text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 - CONTENT */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">3</span>
            <label className="text-sm text-gray-300 font-semibold">Describe it (or just speak)</label>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type here, pick a suggestion above, or tap the mic below to speak..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition h-28 resize-none"
            maxLength={300}
          />
          <p className="text-gray-500 text-xs mt-1 text-right">{content.length}/300</p>

          {translating && (
            <p className="text-cyan-400 text-xs mt-1 animate-pulse">🌐 Translating your voice to English...</p>
          )}
          {isListening && (
            <p className="text-red-400 text-xs mt-1 animate-pulse">🔴 Listening... speak now!</p>
          )}

          {/* VOICE + PROOF UPLOAD - inline row, no boxes */}
          <div className="flex flex-wrap items-center gap-3 mt-3">

            <button
              onClick={handleVoice}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${
                isListening
                  ? 'bg-red-500 animate-pulse text-white'
                  : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30'
              }`}
            >
              {isListening ? '⏹️ Stop' : '🎙️ Speak update'}
            </button>

            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-gray-300 text-sm focus:outline-none cursor-pointer"
            >
              <option className="bg-[#0f172a]" value="en-IN">🇮🇳 English</option>
              <option className="bg-[#0f172a]" value="te-IN">తెలుగు Telugu</option>
              <option className="bg-[#0f172a]" value="hi-IN">हिंदी Hindi</option>
              <option className="bg-[#0f172a]" value="ta-IN">தமிழ் Tamil</option>
              <option className="bg-[#0f172a]" value="kn-IN">ಕನ್ನಡ Kannada</option>
              <option className="bg-[#0f172a]" value="ml-IN">മലയാളം Malayalam</option>
              <option className="bg-[#0f172a]" value="mr-IN">मराठी Marathi</option>
              <option className="bg-[#0f172a]" value="bn-IN">বাংলা Bengali</option>
              <option className="bg-[#0f172a]" value="gu-IN">ગુજરાતી Gujarati</option>
              <option className="bg-[#0f172a]" value="pa-IN">ਪੰਜਾਬੀ Punjabi</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm cursor-pointer bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition">
              📷 {selectedImage ? selectedImage.name.slice(0, 15) + '...' : 'Upload proof'}
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          </div>

          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-3 rounded-2xl w-full max-h-48 object-cover border border-white/10" />
          )}
        </div>

        {/* TIMESTAMP NOTE */}
        <p className="text-gray-500 text-xs mb-6 text-center">
          🕐 Posted automatically at {timePosted} on {datePosted}
        </p>

        {/* SUBMIT */}
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
    </div>
  );
}

export default PostCreate;