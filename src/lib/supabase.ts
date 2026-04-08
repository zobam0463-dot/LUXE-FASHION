import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (import.meta.env as any).SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env as any).SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Environment Variables.');
      
      // Return a safe proxy that logs errors instead of crashing the UI
      const safeHandler: any = {
        get: (target: any, prop: string) => {
          if (prop === 'then') return undefined;
          return (...args: any[]) => {
            console.error(`Supabase method "${prop}" called but client is not initialized.`);
            return Promise.resolve({ data: [], error: new Error('Supabase not configured') });
          };
        }
      };

      return new Proxy({}, safeHandler) as any;
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
