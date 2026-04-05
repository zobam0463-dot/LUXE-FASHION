import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-right',
      style: {
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-orange-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
            <div className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
              <Eye size={20} />
            </div>
          </div>
          <button
            onClick={(e) => {
              handleAddToCart(e);
              window.location.href = '/cart';
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150 hover:bg-orange-600 shadow-lg"
          >
            PAY NOW
          </button>
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
            {product.category}
          </p>
          <p className="text-sm font-bold text-orange-600">
            {formatCurrency(product.price)}
          </p>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-gray-900 font-semibold text-lg group-hover:text-orange-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
