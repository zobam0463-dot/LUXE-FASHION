import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  Plus,
  X,
  Image as ImageIcon,
  Lock,
  Trash2,
  Upload,
  ShieldCheck
} from 'lucide-react';
import { supabase, Order, Product } from '../lib/supabase';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Sneakers',
    gender: 'men',
    image_url: '',
    description: '',
    stock: '10'
  });

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setNewProduct({ ...newProduct, image_url: response.data.publicUrl });
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const detailedError = error.response?.data?.details || error.response?.data?.error || error.message || 'Failed to upload image';
      toast.error(detailedError);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Luxe123') {
      setIsAuthenticated(true);
      toast.success('Welcome back, Admin!');
    } else {
      toast.error('Incorrect password');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const calculateStats = (data: Order[]) => {
    const revenue = data.reduce((sum, order) => sum + (order.status === 'paid' ? Number(order.total_amount) : 0), 0);
    const pending = data.filter(o => o.status === 'pending').length;
    const paid = data.filter(o => o.status === 'paid').length;

    setStats({
      totalRevenue: revenue,
      totalOrders: data.length,
      pendingOrders: pending,
      paidOrders: paid
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAuthenticated]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Order status updated');
      fetchOrders();
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('products')
      .insert([{
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        gender: newProduct.gender,
        image_url: newProduct.image_url,
        description: newProduct.description,
        stock: parseInt(newProduct.stock)
      }]);

    if (error) {
      toast.error('Failed to add product: ' + error.message);
    } else {
      toast.success('Product added successfully!');
      setShowAddModal(false);
      setNewProduct({
        name: '',
        price: '',
        category: 'Sneakers',
        gender: 'men',
        image_url: '',
        description: '',
        stock: '10'
      });
      fetchProducts();
    }
    setLoading(false);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-gray-100 text-gray-700'
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 w-full max-w-md text-center"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock size={40} className="text-orange-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">ADMIN ACCESS</h2>
          <p className="text-gray-500 mb-8 font-medium">Please enter the admin password to continue.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 transition-colors text-center font-bold tracking-widest"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
            >
              LOGIN TO DASHBOARD
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">ADMIN DASHBOARD</h1>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setActiveTab('orders')}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-sm transition-all",
                activeTab === 'orders' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              ORDERS
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-sm transition-all",
                activeTab === 'products' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              PRODUCTS
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          {activeTab === 'products' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
            >
              <Plus size={20} />
              ADD NEW PRODUCT
            </button>
          )}
          <button 
            onClick={activeTab === 'orders' ? fetchOrders : fetchProducts}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            REFRESH
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
              { label: 'Paid Orders', value: stats.paidOrders, icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">RECENT ORDERS</h3>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="w-full bg-gray-50 border border-gray-200 pl-12 pr-6 py-3 rounded-full text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <button className="p-3 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:text-orange-500 transition-colors">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      </tr>
                    ))
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-900">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </td>
                        <td className="px-8 py-6 font-bold text-orange-600">{formatCurrency(order.total_amount)}</td>
                        <td className="px-8 py-6">
                          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", statusColors[order.status as keyof typeof statusColors])}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-gray-50 border border-gray-200 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:border-orange-500 transition-colors cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-bold">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Products Management */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-64 rounded-3xl animate-pulse border border-gray-100"></div>
            ))
          ) : products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {product.gender}
                  </div>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">{product.category}</p>
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-900">{formatCurrency(product.price)}</span>
                  <span className="text-xs text-gray-500 font-medium">Stock: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Plus className="text-orange-500" size={20} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">ADD NEW PRODUCT</h3>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g. Nike Air Max"
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-3 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₦)</label>
                  <input 
                    required
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="25000"
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-3 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-3 rounded-2xl outline-none focus:border-orange-500 transition-colors appearance-none"
                  >
                    <option value="Sneakers">Sneakers</option>
                    <option value="Casual">Casual</option>
                    <option value="Sports">Sports</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Gender</label>
                  <select 
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({...newProduct, gender: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-3 rounded-2xl outline-none focus:border-orange-500 transition-colors appearance-none"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        required
                        type="url" 
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-gray-50 border border-gray-200 pl-12 pr-6 py-3 rounded-2xl outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={cn(
                          "flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all cursor-pointer shadow-lg h-full",
                          isUploading 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-orange-100"
                        )}
                      >
                        {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <Upload size={20} />}
                        {isUploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Describe the product..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
                  >
                    {loading ? 'ADDING PRODUCT...' : 'ADD PRODUCT TO STORE'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
