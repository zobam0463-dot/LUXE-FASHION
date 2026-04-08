import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase Setup
let supabaseClient: any = null;
const getSupabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
    }
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseClient;
};

// Paystack Config
const getPaystackSecret = () => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is required");
  }
  return secret;
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: { 
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasPaystackKey: !!process.env.PAYSTACK_SECRET_KEY,
    hasAppUrl: !!process.env.APP_URL,
    appUrl: process.env.APP_URL
  }});
});

app.post("/api/create-order", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { customer, items, totalAmount } = req.body;

    // 1. Create Order in Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          total_amount: totalAmount,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/initialize-payment", async (req, res) => {
  try {
    const PAYSTACK_SECRET = getPaystackSecret();
    const { email, amount, orderId } = req.body;

    console.log('Initialize Payment Request:', { email, amount, orderId });

    if (!email || amount === undefined || amount === null || !orderId) {
      const missing = [];
      if (!email) missing.push("email");
      if (amount === undefined || amount === null) missing.push("amount");
      if (!orderId) missing.push("orderId");
      console.error('Missing fields:', missing);
      return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
    }

    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({ error: "Amount must be a valid number greater than zero" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address format" });
    }

    // Ensure APP_URL has a protocol
    let baseUrl = process.env.APP_URL || "";
    if (baseUrl && !baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }
    
    // Fallback if APP_URL is completely missing (not ideal but better than crashing)
    if (!baseUrl) {
      baseUrl = `${req.protocol}://${req.get('host')}`;
    }

    console.log(`Initializing Paystack for order ${orderId} with callback: ${baseUrl}/payment-success?orderId=${orderId}`);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo (integer)
        callback_url: `${baseUrl}/payment-success?orderId=${orderId}`,
        metadata: {
          orderId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Paystack Init Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to initialize payment", 
      details: errorMessage,
      paystackError: error.response?.data
    });
  }
});

app.get("/api/verify-payment", async (req, res) => {
  try {
    const supabase = getSupabase();
    const PAYSTACK_SECRET = getPaystackSecret();
    const { reference, orderId } = req.query;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    if (response.data.data.status === "success") {
      // Update order status in Supabase
      const { error } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);

      if (error) throw error;

      res.json({ success: true, data: response.data.data });
    } else {
      res.json({ success: false, message: "Payment not successful" });
    }
  } catch (error: any) {
    console.error("Paystack Verify Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

app.post("/api/paystack-webhook", async (req, res) => {
  // Webhook implementation for reliability
  const event = req.body;
  if (event.event === "charge.success") {
    const orderId = event.data.metadata.orderId;
    const supabase = getSupabase();
    await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);
  }
  res.sendStatus(200);
});


const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/admin/upload-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const supabase = getSupabase();
    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message.includes('bucket not found')) {
        // Try to create it first
        await supabase.storage.createBucket('products', { public: true });
        // Retry
        const { error: retryError } = await supabase.storage
          .from('products')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false
          });
        if (retryError) throw retryError;
      } else {
        throw uploadError;
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    res.json({ success: true, publicUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image", details: error.message });
  }
});

app.post("/api/admin/setup-storage", async (req, res) => {
  try {
    const supabase = getSupabase();
    
    // Create bucket if it doesn't exist
    const { data, error } = await supabase.storage.createBucket('products', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error && error.message !== 'Bucket already exists') {
      throw error;
    }

    res.json({ success: true, message: "Storage bucket 'products' initialized successfully" });
  } catch (error: any) {
    console.error("Storage Setup Error:", error);
    res.status(500).json({ error: "Failed to setup storage", details: error.message });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
