import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, Product } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (data) setNewArrivals(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80', path: '/men' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80', path: '/women' },
    { name: 'Kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69af63e6?auto=format&fit=crop&q=80', path: '/kids' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80', path: '/collections' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80"
            className="w-full h-full object-cover"
            alt="Hero Fashion"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 font-bold tracking-[0.3em] uppercase mb-4"
          >
            New Season Arrival
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight"
          >
            ELEVATE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">STYLE</span> GAME
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/collections"
              className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all flex items-center gap-2 group"
            >
              SHOP COLLECTION
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/new-arrivals"
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
            >
              LATEST TRENDS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₦50,000' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: Star, title: 'Premium Quality', desc: 'Crafted with care' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <feature.icon className="text-orange-500 mb-2" size={32} />
              <h3 className="font-bold text-gray-900">{feature.title}</h3>
              <p className="text-xs text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">SHOP BY CATEGORY</h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={cat.path}
              className="group relative h-[400px] rounded-3xl overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <span className="text-orange-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Explore <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-orange-500 font-bold uppercase tracking-widest mb-2">Fresh Picks</p>
              <h2 className="text-4xl font-black text-white">NEW ARRIVALS</h2>
            </div>
            <Link to="/new-arrivals" className="text-white hover:text-orange-500 font-bold flex items-center gap-2 transition-colors">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/5 animate-pulse rounded-2xl h-[450px]" />
              ))
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-orange-500 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-center">
          <div className="p-12 lg:p-24 flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              GET 20% OFF YOUR <br /> FIRST ORDER
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-md">
              Join our fashion community and stay updated with the latest trends and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white px-8 py-4 rounded-full flex-1 outline-none focus:ring-4 ring-white/20"
              />
              <button className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all">
                SUBSCRIBE
              </button>
            </div>
          </div>
          <div className="flex-1 h-full min-h-[400px] w-full lg:w-auto">
            <img
              src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80"
              className="w-full h-full object-cover"
              alt="Promo"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">WHAT OUR CLIENTS SAY</h2>
            <div className="w-20 h-1.5 bg-orange-500 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Fashion Blogger', text: 'The quality of the fabrics is exceptional. I love how modern and chic the designs are.' },
              { name: 'Michael Chen', role: 'Business Executive', text: 'Fast delivery and premium packaging. The suits fit perfectly and look very expensive.' },
              { name: 'Aisha Bello', role: 'Stylist', text: 'My go-to store for unique pieces. The customer service is also top-notch.' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-3xl relative">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className="fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-8">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
