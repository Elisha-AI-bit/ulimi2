-- Ulimi Smart Farming System - Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('farmer', 'buyer', 'vendor', 'admin')) NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farms table
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  size NUMERIC NOT NULL, -- in acres/hectares
  crop_type TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensor data table
CREATE TABLE sensor_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  soil_moisture NUMERIC,
  temperature NUMERIC,
  humidity NUMERIC,
  ph_level NUMERIC,
  nitrogen NUMERIC,
  phosphorus NUMERIC,
  potassium NUMERIC,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pest/disease detection table
CREATE TABLE pest_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  detected_pest TEXT,
  confidence NUMERIC,
  recommendation TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (for marketplace)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Livestock table
CREATE TABLE livestock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('cattle', 'sheep', 'goat', 'pig', 'chicken', 'other')) NOT NULL,
  breed TEXT,
  age INTEGER,
  weight NUMERIC,
  health_status TEXT CHECK (health_status IN ('healthy', 'sick', 'recovering', 'quarantined')) DEFAULT 'healthy',
  last_health_check TIMESTAMP WITH TIME ZONE,
  next_vaccination TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Livestock health data table
CREATE TABLE livestock_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES livestock(id) ON DELETE CASCADE,
  temperature NUMERIC,
  activity_level NUMERIC,
  food_intake NUMERIC,
  water_intake NUMERIC,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendation feedback table
CREATE TABLE recommendation_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recommendation_id UUID REFERENCES recommendations(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  feedback TEXT CHECK (feedback IN ('helpful', 'not_helpful', 'somewhat_helpful')) NOT NULL,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_feedback ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (id = auth.uid());

-- Farms policies
CREATE POLICY "Farmers can view their own farms" ON farms
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Farmers can create farms" ON farms
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Farmers can update their own farms" ON farms
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Farmers can delete their own farms" ON farms
  FOR DELETE USING (owner_id = auth.uid());

-- Sensor data policies
CREATE POLICY "Farmers can view sensor data for their farms" ON sensor_data
  FOR SELECT USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

CREATE POLICY "Farmers can insert sensor data for their farms" ON sensor_data
  FOR INSERT WITH CHECK (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

-- Pest detections policies
CREATE POLICY "Farmers can view pest detections for their farms" ON pest_detections
  FOR SELECT USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

CREATE POLICY "Farmers can insert pest detections for their farms" ON pest_detections
  FOR INSERT WITH CHECK (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

-- Products policies
CREATE POLICY "Vendors can view their own products" ON products
  FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can create products" ON products
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own products" ON products
  FOR UPDATE USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete their own products" ON products
  FOR DELETE USING (vendor_id = auth.uid());

CREATE POLICY "Everyone can view all products" ON products
  FOR SELECT USING (true);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (buyer_id = auth.uid() OR EXISTS (SELECT 1 FROM products WHERE products.id = orders.product_id AND products.vendor_id = auth.uid()));

CREATE POLICY "Buyers can create orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Vendors can update order status for their products" ON orders
  FOR UPDATE USING (EXISTS (SELECT 1 FROM products WHERE products.id = orders.product_id AND products.vendor_id = auth.uid()));

-- Livestock policies
CREATE POLICY "Farmers can view their own livestock" ON livestock
  FOR SELECT USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

CREATE POLICY "Farmers can manage their own livestock" ON livestock
  FOR ALL USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

-- Livestock health policies
CREATE POLICY "Farmers can view health data for their livestock" ON livestock_health
  FOR SELECT USING (animal_id IN (SELECT id FROM livestock WHERE farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid())));

CREATE POLICY "Farmers can insert health data for their livestock" ON livestock_health
  FOR INSERT WITH CHECK (animal_id IN (SELECT id FROM livestock WHERE farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid())));

-- Recommendations policies
CREATE POLICY "Farmers can view recommendations for their farms" ON recommendations
  FOR SELECT USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

-- Recommendation feedback policies
CREATE POLICY "Farmers can submit feedback for recommendations on their farms" ON recommendation_feedback
  FOR INSERT WITH CHECK (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

-- Admin policies
CREATE POLICY "Admins can view all data" ON users
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can view all farms" ON farms
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can view all sensor data" ON sensor_data
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can view all pest detections" ON pest_detections
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can view all livestock" ON livestock
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can view all recommendations" ON recommendations
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('pest-images', 'pest-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies
CREATE POLICY "Anyone can upload pest images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pest-images');

CREATE POLICY "Anyone can read pest images" ON storage.objects
  FOR SELECT USING (bucket_id = 'pest-images');

CREATE POLICY "Vendors can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');