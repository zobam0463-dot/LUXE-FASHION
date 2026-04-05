-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('men', 'women', 'kids')),
  image_url TEXT NOT NULL,
  description TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(12, 2) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for Products (Public Read)
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Policies for Orders (Public Insert, Admin Read/Update)
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read Orders" ON orders FOR SELECT USING (true); -- In production, restrict to admin
CREATE POLICY "Admin Update Orders" ON orders FOR UPDATE USING (true); -- In production, restrict to admin

-- Policies for Order Items
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read Order Items" ON order_items FOR SELECT USING (true);

-- Insert Sample Data
INSERT INTO products (name, price, category, gender, image_url, description, stock) VALUES
('Premium Leather Jacket', 45000, 'Jackets', 'men', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80', 'High-quality genuine leather jacket with a modern slim fit.', 10),
('Floral Summer Dress', 25000, 'Clothing', 'women', 'https://images.unsplash.com/photo-1572804013307-a9a111d7248e?auto=format&fit=crop&q=80', 'Lightweight and breathable floral dress perfect for summer outings.', 15),
('Classic White Sneakers', 18000, 'Sneakers', 'men', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80', 'Versatile white sneakers that go with any outfit.', 20),
('Gold Plated Necklace', 35000, 'Jewelries/Gold', 'women', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80', 'Elegant 18k gold plated necklace with a minimalist pendant.', 5),
('Denim Kids Overalls', 12000, 'Clothing', 'kids', 'https://images.unsplash.com/photo-1519233943852-69169601f54a?auto=format&fit=crop&q=80', 'Durable and cute denim overalls for active kids.', 12),
('Summer Breathable Sports Shoes', 15000, 'Sneakers', 'kids', 'https://i.ibb.co/spvnBjt2/Men-s-Shoes-New-Summer-Breathable-Korean-Style-Sports-Shoes-Mesh-Casual-Shoes-Student-Lightweight-Ru.jpg', 'Lightweight and breathable sports shoes for active kids.', 25),
('Classic Click & Buy Sneakers', 18500, 'Sneakers', 'kids', 'https://i.ibb.co/F4GSt8m5/Click-Buy.jpg', 'Stylish and comfortable sneakers for everyday wear.', 18),
('Pro Performance Sneakers', 22000, 'Sneakers', 'kids', 'https://i.ibb.co/why4kvQ1/Men-s-Shoes-Sneakers.jpg', 'High-performance sneakers designed for sports and play.', 15),
('Wongn Style Mesh Casuals', 16000, 'Sneakers', 'kids', 'https://i.ibb.co/xSTQwD7F/Wongn-Men-s-Shoes-2022-New-Style-Summer-Breathable-Wild-Mesh-Sports-Casual-Youth-Increase-Old-Fashio.jpg', 'Modern mesh casual shoes with a breathable design.', 20),
('Breathable Basketball Baskets', 20000, 'Sneakers', 'kids', 'https://i.ibb.co/1tQmrY2x/Chaussures-de-basket-ball-respirantes-pour-hommes-chaussures-de-sport-pour-hommes-baskets.jpg', 'Professional style basketball sneakers for young athletes.', 10);
