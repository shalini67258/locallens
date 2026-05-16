import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Feed from './pages/Feed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Feed page - shows when URL is /feed */}
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;