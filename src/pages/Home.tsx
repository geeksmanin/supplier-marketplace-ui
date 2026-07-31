import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@geeksman/core-ui';

interface Product {
  id: number;
  name: string;
  brand_name: string;
  category: string;
  description: string;
  is_active: boolean;
  variants?: Array<{
    id: number;
    price: number;
  }>;
}

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    apiClient
      .get('/rfq/vendor-products', { params: { limit: 100 } })
      .then((res: any) => {
        if (res.data && res.data.data) {
          // Only show active listings in the marketplace
          setProducts(res.data.data.filter((p: any) => p.is_active));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Supplier Marketplace
          </h1>
          <p className="text-slate-400 mt-2">
            Browse high-quality products and order directly from verified suppliers.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Categories Sidebar */}
          <div className="w-full md:w-[240px] bg-slate-800 border border-slate-700 rounded-2xl p-4 self-start">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Categories
            </h2>
            <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-left text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-slate-100 shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
              <input
                type="text"
                placeholder="Search products or brands..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400">
                No products found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const basePrice = p.variants?.[0]?.price || 0;
                  return (
                    <div
                      key={p.id}
                      className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
                    >
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                            {p.brand_name || 'Generic'}
                          </div>
                          <h3 className="text-lg font-bold text-slate-100 mt-1">{p.name}</h3>
                          <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                            {p.description || 'No description available.'}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                          <div>
                            <span className="text-xs text-slate-500 block">Starting at</span>
                            <span className="text-lg font-bold text-emerald-400">
                              ${basePrice.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
