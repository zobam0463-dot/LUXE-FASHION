import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
      const orderResponse = await axios.post('/api/create-order', {
        customer: formData,
        items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
        totalAmount: total,
      });

      const { orderId } = orderResponse.data;

      // 2. Initialize Paystack
      console.log('Initializing payment with:', { email: formData.email, amount: total, orderId });
      const paystackResponse = await axios.post('/api/initialize-payment', {
        email: formData.email,
        amount: total,
        orderId: orderId,
      });

      const { authorization_url } = paystackResponse.data.data;
      
      // Redirect to Paystack
      window.location.href = authorization_url;
    } catch (error: any) {
      console.error('Checkout Error:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      }
      const detailedError = error.response?.data?.error || error.response?.data?.details || error.message || 'Something went wrong. Please try again.';
      toast.error(detailedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/cart')} className="text-gray-400 hover:text-orange-500 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-black text-gray-900">CHECKOUT</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Form */}
        <div className="flex-1">
          <form onSubmit={handlePayNow} className="space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck size={20} className="text-orange-500" />
                DELIVERY INFORMATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="+234 900 000 0000"
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Delivery Address</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Full street address, city, state"
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-500" />
                PAYMENT METHOD
              </h3>
              <div className="p-6 bg-orange-50 rounded-3xl border-2 border-orange-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img src="https://paystack.com/assets/img/paystack-logo-vector.svg" alt="Paystack" className="h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Paystack Secure Payment</p>
                    <p className="text-xs text-gray-500">Pay with Card, Bank Transfer, or USSD</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-orange-500 bg-white" />
              </div>
            </section>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gray-900 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  INITIALIZING SECURE PAYMENT...
                </>
              ) : (
                <>
                  <ShieldCheck size={22} />
                  PAY {formatCurrency(total)} NOW
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-96">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-32">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">ORDER SUMMARY</h3>
            
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-orange-600">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-900 font-black text-xl pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-xs text-gray-500">
              <ShieldCheck size={16} className="text-green-500 shrink-0" />
              Your payment is encrypted and secure. We never store your card details.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
