import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Environment Variables.');
      // Return a dummy client that doesn't throw immediately but returns empty data
      return {
        from: () => ({
          select: () => ({
            order: () => ({
              order: () => Promise.resolve({ data: [], error: null })
            }),
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null })
            })
          }),
          insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        }),
        storage: {
          from: () => ({
            upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
            getPublicUrl: () => ({ data: { publicUrl: '' } })
          })
        }
      } as any;
    }
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

// For backward compatibility in existing components
export const supabase = new Proxy({}, {
  get: (target, prop) => {
    return getSupabase()[prop];
  }
}) as any;

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  gender: 'men' | 'women' | 'kids';
  image_url: string;
  description: string;
  stock: number;
  created_at?: string;
};

export type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
};
