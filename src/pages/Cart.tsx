import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Cart = () => {
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our latest collections and find something you love.
        </p>
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all"
        >
          START SHOPPING <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-gray-900 mb-12">SHOPPING CART</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Items List */}
        <div className="flex-1 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-gray-100"
              >
                <div className="w-32 h-40 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">{item.category}</p>
                  <p className="text-lg font-bold text-orange-600">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 hover:text-orange-500 shadow-sm transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 hover:text-orange-500 shadow-sm transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="text-right sm:w-32">
                  <p className="text-xl font-black text-gray-900 mb-4">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <aside className="w-full lg:w-96">
          <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] sticky top-32">
            <h3 className="text-2xl font-bold mb-8">ORDER SUMMARY</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span className="text-white font-bold">{formatCurrency(0)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-3xl font-black text-orange-500">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-orange-500 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
            >
              PROCEED TO CHECKOUT
              <ArrowRight size={20} />
            </Link>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-50 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
