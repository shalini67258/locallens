import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/postService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Trends() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const posts = await getAllPosts();

      // Ensure posts is an array to avoid crashes
      const safePosts = Array.isArray(posts) ? posts : [];

      const areaCounts = {};
      const categoryCounts = {};
      
      safePosts.forEach(post => {
        if (post && post.area) {
          areaCounts[post.area] = (areaCounts[post.area] || 0) + 1;
        }
        if (post && post.category) {
          categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
        }
      });

      setChartData(Object.entries(areaCounts).map(([area, count]) => ({ area, count })));
      setCategoryData(Object.entries(categoryCounts).map(([category, count]) => ({ category, count })));
    } catch (error) {
      console.error("Error loading trends data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      <button onClick={() => navigate('/')} className="text-cyan-400 mb-6 hover:underline transition">
        ← Back
      </button>
      <h2 className="text-3xl font-black mb-8">📊 Trending Areas & Categories</h2>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium">
          Loading metrics and community insights...
        </div>
      ) : (
        <>
          {/* Chart 1: Posts by Area */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Posts by Area</h3>
            <div className="w-full h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="area" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
                    <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm flex items-center justify-center h-full">No area metrics available</p>
              )}
            </div>
          </div>

          {/* Chart 2: Posts by Category */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-6">
            <h3 className="text-xl font-bold mb-4">Posts by Category</h3>
            <div className="w-full h-[300px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="category" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
                    <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm flex items-center justify-center h-full">No category metrics available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Trends;