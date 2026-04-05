import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProduct(data);
        // Fetch related
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(4);
        if (related) setRelatedProducts(related);
      }
      setLoading(false);
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem(product);
    toast.success('Added to cart!');
  };

  if (loading) return <div className="pt-40 text-center text-2xl font-bold">Loading...</div>;
  if (!product) return <div className="pt-40 text-center text-2xl font-bold">Product not found.</div>;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 mb-24">
        {/* Gallery */}
        <div className="flex-1 space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                <img src={product.image_url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-widest mb-4">
              <Star size={16} className="fill-orange-500" />
              <span>Best Seller in {product.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(product.price)}</p>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description || "Experience ultimate comfort and style with our premium fashion piece. Crafted from high-quality materials, this item is designed to elevate your everyday look while ensuring durability and a perfect fit."}
          </p>

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-900">SELECT SIZE</h4>
              <button className="text-sm text-orange-500 font-bold hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-14 h-14 rounded-xl border-2 font-bold transition-all flex items-center justify-center",
                    selectedSize === size
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 group"
            >
              <ShoppingCart size={22} className="group-hover:-translate-y-1 transition-transform" />
              ADD TO CART
            </button>
            <button className="w-16 h-16 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
              <Heart size={24} />
            </button>
            <button className="w-16 h-16 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all">
              <Share2 size={24} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                <Truck size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Free Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <RotateCcw size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">30 Days Return</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">YOU MAY ALSO LIKE</h2>
            <div className="w-16 h-1.5 bg-orange-500 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
