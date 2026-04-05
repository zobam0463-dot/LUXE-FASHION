import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageSquare, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../lib/utils';
import axios from 'axios';
import { motion } from 'motion/react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference || !orderId) {
        setStatus('error');
        return;
      }

      try {
        const response = await axios.get(`/api/verify-payment?reference=${reference}&orderId=${orderId}`);
        if (response.data.success) {
          setStatus('success');
          setOrderDetails(response.data.data);
          clearCart();
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification Error:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [reference, orderId]);

  const handleWhatsAppRedirect = () => {
    if (!orderDetails) return;
    
    const amount = formatCurrency(orderDetails.amount / 100);
    const message = `I have made payment for Order #${orderId} worth ${amount}. Kindly confirm and get back to me.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/09031433152?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (status === 'loading') {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-8" />
        <h1 className="text-3xl font-black text-gray-900 mb-4">VERIFYING PAYMENT...</h1>
        <p className="text-gray-500">Please wait while we confirm your transaction with Paystack.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-8" />
        <h1 className="text-4xl font-black text-gray-900 mb-4">PAYMENT FAILED</h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          We couldn't verify your payment. If you were charged, please contact our support with your reference: <span className="font-bold text-gray-900">{reference}</span>
        </p>
        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
        >
          TRY AGAIN
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 px-6 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
          <CheckCircle2 size={56} />
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">PAYMENT SUCCESSFUL!</h1>
        <p className="text-gray-500 text-lg">
          Thank you for your purchase. Your order <span className="font-bold text-gray-900">#{orderId}</span> has been confirmed.
        </p>
      </motion.div>

      <div className="bg-gray-50 rounded-[3rem] p-10 mb-12 border border-gray-100">
        <div className="space-y-4 mb-10">
          <div className="flex justify-between text-gray-500">
            <span>Transaction Reference</span>
            <span className="text-gray-900 font-bold">{reference}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Amount Paid</span>
            <span className="text-orange-600 font-bold">{formatCurrency(orderDetails.amount / 100)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Payment Status</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Verified</span>
          </div>
        </div>

        <button
          onClick={handleWhatsAppRedirect}
          className="w-full bg-green-500 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 group"
        >
          <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
          CONFIRM ON WHATSAPP
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <Link
          to="/"
          className="text-gray-500 font-bold hover:text-orange-500 transition-colors flex items-center gap-2"
        >
          BACK TO HOME
        </Link>
        <Link
          to="/collections"
          className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          CONTINUE SHOPPING <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Success;
