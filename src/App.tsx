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
