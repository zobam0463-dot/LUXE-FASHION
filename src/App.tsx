import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Teams from './pages/Teams';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const isMissingVars = (!import.meta.env.VITE_SUPABASE_URL && !(import.meta.env as any).SUPABASE_URL) || 
                       (!import.meta.env.VITE_SUPABASE_ANON_KEY && !(import.meta.env as any).SUPABASE_ANON_KEY);

  if (isMissingVars && import.meta.env.PROD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase">Configuration Required</h1>
          <p className="text-gray-600 mb-6">
            Your ecommerce website is almost ready! Please add your <strong>Supabase Environment Variables</strong> in the Vercel dashboard to see your products.
          </p>
          <div className="bg-gray-50 p-4 rounded-2xl text-left text-sm font-mono text-gray-500 mb-6">
            VITE_SUPABASE_URL<br />
            VITE_SUPABASE_ANON_KEY
          </div>
          <a 
            href="https://vercel.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
          >
            GO TO VERCEL DASHBOARD
          </a>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-arrivals" element={<ProductListing />} />
            <Route path="/:gender" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<Success />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Fallback for subcategories */}
            <Route path="/:gender/:category" element={<ProductListing />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
