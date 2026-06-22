import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, saveToken } from '../services/authService';

function Login() {
  const navigate = useNavigate();

  // Toggle between login and register
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      let response;

      if (isRegister) {
        // Register new user
        response = await register(name, email, password, city);
      } else {
        // Login existing user
        response = await login(email, password);
      }

      if (response.error) {
        setError(response.error);
      } else {
        // Save token and user info
        saveToken(response.token, response.name, response.email);
        // Go to home page
        navigate('/');
      }
    } catch (err) {
      setError('Something went wrong! Check if backend is running.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-4">

      <div className="fixed top-[-120px] left-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
            🌍 LocalLens
          </h1>
          <p className="text-gray-400 mt-2">
            {isRegister ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-xl">

          <h2 className="text-2xl font-black mb-6">
            {isRegister ? '📝 Register' : '🔐 Login'}
          </h2>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-3 text-red-300 text-sm mb-4">
              ❌ {error}
            </div>
          )}

          {/* NAME - only for register */}
          {isRegister && (
            <div className="mb-4">
              <label className="text-gray-400 text-sm font-semibold mb-2 block">
                👤 Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm font-semibold mb-2 block">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm font-semibold mb-2 block">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* CITY - only for register */}
          {isRegister && (
            <div className="mb-6">
              <label className="text-gray-400 text-sm font-semibold mb-2 block">
                📍 Your City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="eg: Hyderabad, Mumbai..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-cyan-500/30 hover:scale-105 transition disabled:opacity-50 disabled:scale-100 mb-4"
          >
            {loading ? '⏳ Please wait...' : isRegister ? '🚀 Create Account' : '🔐 Login'}
          </button>

          {/* TOGGLE LOGIN/REGISTER */}
          <p className="text-center text-gray-400 text-sm">
            {isRegister ? 'Already have account?' : "Don't have account?"}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-cyan-400 font-bold ml-2 hover:text-cyan-300 transition"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>

        </div>

        {/* BACK TO HOME */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 py-3 text-gray-400 hover:text-white transition text-sm"
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default Login;