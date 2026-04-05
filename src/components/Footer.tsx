import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="text-3xl font-bold tracking-tighter">
            <span className="text-orange-500">LUXE</span>
            <span>FASHION</span>
          </Link>
          <p className="text-gray-400 leading-relaxed">
            Elevate your style with our premium collection of luxury fashion. Quality craftsmanship meets modern design.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/new-arrivals" className="hover:text-orange-500 transition-colors">New Arrivals</Link></li>
            <li><Link to="/men" className="hover:text-orange-500 transition-colors">Men's Collection</Link></li>
            <li><Link to="/women" className="hover:text-orange-500 transition-colors">Women's Collection</Link></li>
            <li><Link to="/kids" className="hover:text-orange-500 transition-colors">Kids' Collection</Link></li>
            <li><Link to="/collections" className="hover:text-orange-500 transition-colors">All Collections</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-bold mb-6">Customer Service</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
            <li><Link to="/shipping" className="hover:text-orange-500 transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-orange-500 transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/faq" className="hover:text-orange-500 transition-colors">FAQs</Link></li>
            <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-orange-500 shrink-0" />
              <span>123 Fashion Avenue, Style City, Lagos, Nigeria</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-orange-500 shrink-0" />
              <span>+234 903 143 3152</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-orange-500 shrink-0" />
              <span>support@luxefashion.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          © 2026 LuxeFashion. All rights reserved.
        </p>
        <div className="flex gap-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
