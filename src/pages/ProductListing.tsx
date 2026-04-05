import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

const ProductListing = () => {
  const { gender } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState(100000);

  const fallbackKidsProducts: Product[] = [
    {
      id: 'kids-1',
      name: 'Summer Breathable Sports Shoes',
      price: 15000,
      category: 'Sneakers',
      gender: 'kids',
      image_url: 'https://i.ibb.co/spvnBjt2/Men-s-Shoes-New-Summer-Breathable-Korean-Style-Sports-Shoes-Mesh-Casual-Shoes-Student-Lightweight-Ru.jpg',
      description: 'Lightweight and breathable sports shoes for active kids.',
      stock: 25
    },
    {
      id: 'kids-2',
      name: 'Classic Click & Buy Sneakers',
      price: 18500,
      category: 'Sneakers',
      gender: 'kids',
      image_url: 'https://i.ibb.co/F4GSt8m5/Click-Buy.jpg',
      description: 'Stylish and comfortable sneakers for everyday wear.',
      stock: 18
    },
    {
      id: 'kids-3',
      name: 'Pro Performance Sneakers',
      price: 22000,
      category: 'Sneakers',
      gender: 'kids',
      image_url: 'https://i.ibb.co/why4kvQ1/Men-s-Shoes-Sneakers.jpg',
      description: 'High-performance sneakers designed for sports and play.',
      stock: 15
    },
    {
      id: 'kids-4',
      name: 'Wongn Style Mesh Casuals',
      price: 16000,
      category: 'Sneakers',
      gender: 'kids',
      image_url: 'https://i.ibb.co/xSTQwD7F/Wongn-Men-s-Shoes-2022-New-Style-Summer-Breathable-Wild-Mesh-Sports-Casual-Youth-Increase-Old-Fashio.jpg',
      description: 'Modern mesh casual shoes with a breathable design.',
      stock: 20
    },
    {
      id: 'kids-5',
      name: 'Breathable Basketball Baskets',
      price: 20000,
      category: 'Sneakers',
      gender: 'kids',
      image_url: 'https://i.ibb.co/1tQmrY2x/Chaussures-de-basket-ball-respirantes-pour-hommes-chaussures-de-sport-pour-hommes-baskets.jpg',
      description: 'Professional style basketball sneakers for young athletes.',
      stock: 10
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        if (gender) {
          query = query.eq('gender', gender);
        }

        if (sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (data && data.length > 0) {
          setProducts(data);
        } else if (gender === 'kids') {
          // Fallback for kids page if DB is empty
          setProducts(fallbackKidsProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (gender === 'kids') setProducts(fallbackKidsProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender, sortBy]);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 uppercase mb-2">
          {gender ? `${gender}'s Collection` : 'All Collections'}
        </h1>
        <p className="text-gray-500">Discover our latest styles and premium designs.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-10">
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Filter size={20} className="text-orange-500" />
              FILTERS
            </h3>
            
            <div className="space-y-8">
              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Category</h4>
                <div className="space-y-3">
                  {['Clothing', 'Jackets', 'Pants', 'Shoes', 'Accessories'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-gray-600 group-hover:text-orange-500 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Price Range</h4>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500 font-medium">
                  <span>₦0</span>
                  <span>₦{priceRange.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-gray-500 font-medium">
              Showing <span className="text-gray-900 font-bold">{products.length}</span> products
            </p>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 px-6 py-3 pr-12 rounded-full text-sm font-bold outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-[450px]" />
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <h3 className="text-2xl font-bold text-gray-400">No products found.</h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
