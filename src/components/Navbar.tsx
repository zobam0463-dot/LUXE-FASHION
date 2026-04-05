import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Search, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'NEW ARRIVALS', path: '/new-arrivals' },
    {
      name: 'MEN',
      path: '/men',
      dropdown: ['Clothing', 'Jackets', 'Pants', 'Shorts', 'T-Shirts'],
    },
    {
      name: 'WOMEN',
      path: '/women',
      dropdown: ['Shoes/Sandals', 'Sneakers', 'Sports', 'Jewelries/Gold'],
    },
    {
      name: 'KIDS',
      path: '/kids',
      dropdown: ['Clothing', 'Jackets', 'Pants', 'Shorts', 'T-Shirts'],
    },
    { name: 'COLLECTIONS', path: '/collections' },
    { name: 'TEAMS', path: '/teams' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-1">
          <span className="text-orange-500">LUXE</span>
          <span className={cn(isScrolled ? 'text-gray-900' : 'text-white')}>FASHION</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="group relative">
              <Link
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors flex items-center gap-1',
                  isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white/90 hover:text-white'
                )}
              >
                {link.name}
                {link.dropdown && <ChevronDown size={14} />}
              </Link>
              {link.dropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item}
                      to={`${link.path}/${item.toLowerCase().replace('/', '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button className={cn(isScrolled ? 'text-gray-700' : 'text-white')}>
            <Search size={20} />
          </button>
          <button className={cn(isScrolled ? 'text-gray-700' : 'text-white')}>
            <User size={20} />
          </button>
          <Link to="/cart" className="relative group">
            <ShoppingCart size={22} className={cn(isScrolled ? 'text-gray-700' : 'text-white')} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={24} className={cn(isScrolled ? 'text-gray-900' : 'text-white')} />
            ) : (
              <Menu size={24} className={cn(isScrolled ? 'text-gray-900' : 'text-white')} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white absolute top-full left-0 right-0 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-semibold text-gray-800 hover:text-orange-500"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
