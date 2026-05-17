import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Feed from './pages/Feed';
import PostCreate from './pages/PostCreate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        {/* PostCreate page */}
        <Route path="/post" element={<PostCreate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;