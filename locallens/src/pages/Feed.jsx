// Feed.jsx - This is the LIVE FEED page
// Shows all real posts from all areas
// Like Twitter feed but for your city!

// useState = React hook to store data
// useNavigate = to go back to home page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Feed() {

  // useNavigate lets us move between pages using code
  const navigate = useNavigate();

  // useState stores our posts data
  // Right now dummy data - later comes from backend!
  const [posts, setPosts] = useState([
    {
      id: 1,
      area: "Kukatpally",
      category: "Emergency",
      emoji: "🚨",
      color: "red",
      content: "Major power cut in Kukatpally till 2PM today!",
      time: "2 mins ago",
      upvotes: 142
    },
    {
      id: 2,
      area: "Miyapur",
      category: "Traffic",
      emoji: "🚧",
      color: "yellow",
      content: "Heavy traffic near Miyapur Metro Station, avoid if possible!",
      time: "8 mins ago",
      upvotes: 92
    },
    {
      id: 3,
      area: "Hitech City",
      category: "Event",
      emoji: "🎉",
      color: "green",
      content: "Food Festival happening at Hitech City this weekend!",
      time: "15 mins ago",
      upvotes: 58
    },
    {
      id: 4,
      area: "Dilsukhnagar",
      category: "Water",
      emoji: "💧",
      color: "blue",
      content: "Water supply will be disrupted tomorrow from 6am to 12pm!",
      time: "30 mins ago",
      upvotes: 201
    }
  ]);

  // selectedArea stores which filter button is active
  // "All" means show everything
  const [selectedArea, setSelectedArea] = useState("All");

  // This filters posts based on selected area
  // If "All" selected → show everything
  // If "Kukatpally" selected → show only Kukatpally posts
  const filteredPosts = selectedArea === "All"
    ? posts
    : posts.filter(post => post.area === selectedArea);

  // Color mapping for each category
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

  // Upvote function - increases upvote count when clicked
  const handleUpvote = (id) => {
    // Go through all posts
    // Find the one with matching id
    // Increase its upvotes by 1
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, upvotes: post.upvotes + 1 }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/10">
        <div className="w-full px-6 lg:px-16 py-4 flex justify-between items-center">

          {/* Back button - goes to home page */}
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300 font-bold"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            🌍 Live Feed
          </h1>

          {/* Post button - will go to create post page later */}
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-full font-bold text-sm">
            + Post
          </button>

        </div>
      </nav>

      <div className="w-full px-6 lg:px-16 py-6">

        {/* AREA FILTER BUTTONS */}
        {/* When you click a button, setSelectedArea updates */}
        {/* Then filteredPosts automatically updates too! */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {["All", "Kukatpally", "Miyapur", "Hitech City", "Dilsukhnagar"].map(area => (
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

        {/* POSTS COUNT */}
        <p className="text-gray-400 text-sm mb-4">
          Showing {filteredPosts.length} updates
          {selectedArea !== "All" ? ` in ${selectedArea}` : " from all areas"}
        </p>

        {/* POST CARDS */}
        {/* We loop through filteredPosts and show each one */}
        {/* .map() = "for each post, create a card" */}
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className={`bg-gradient-to-r ${colorMap[post.color]} border rounded-3xl p-5 mb-4 hover:scale-[1.01] transition`}
          >
            {/* Card top - badge and time */}
            <div className="flex justify-between items-center">
              <span className={`${badgeColorMap[post.color]} px-3 py-1 rounded-full text-xs font-semibold`}>
                {post.emoji} {post.category}
              </span>
              <span className="text-gray-400 text-sm">
                {post.time}
              </span>
            </div>

            {/* Post content */}
            <p className="text-white font-semibold text-lg mt-4">
              {post.content}
            </p>

            {/* Card bottom - area and upvote */}
            <div className="flex items-center mt-4">
              <span className="text-cyan-300 text-sm">
                📍 {post.area}
              </span>
              {/* Upvote button calls handleUpvote with post id */}
              <button
                onClick={() => handleUpvote(post.id)}
                className="ml-auto bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition text-sm"
              >
                👍 {post.upvotes}
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Feed;