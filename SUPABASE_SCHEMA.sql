-- Supabase Schema for ULIMI System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  username TEXT,
  role TEXT CHECK (role IN ('admin', 'farmer', 'customer', 'vendor')),
  province TEXT,
  district TEXT,
  coordinates DOUBLE PRECISION[],
  language TEXT CHECK (language IN ('en', 'ny', 'bem', 'ton')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  size DOUBLE PRECISION,
  province TEXT,
  district TEXT,
  coordinates DOUBLE PRECISION[],
  soil_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crops table
CREATE TABLE IF NOT EXISTS crops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT,
  variety TEXT,
  planting_date DATE,
  expected_harvest_date DATE,
  area DOUBLE PRECISION,
  status TEXT CHECK (status IN ('planned', 'planted', 'growing', 'harvested')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  type TEXT CHECK (type IN ('planting', 'irrigation', 'fertilizing', 'pest_control', 'harvesting', 'maintenance', 'monitoring', 'marketing', 'other')),
  category TEXT CHECK (category IN ('routine', 'seasonal', 'emergency', 'maintenance', 'harvest', 'planning')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue')),
  due_date DATE,
  start_date DATE,
  completed_date DATE,
  estimated_duration DOUBLE PRECISION,
  actual_duration DOUBLE PRECISION,
  assigned_to TEXT[],
  created_by UUID REFERENCES users(id),
  supervised_by UUID REFERENCES users(id),
  dependencies TEXT[],
  weather_dependent BOOLEAN DEFAULT false,
  recurring BOOLEAN DEFAULT false,
  cost_estimated DOUBLE PRECISION,
  cost_actual DOUBLE PRECISION,
  location_field_name TEXT,
  location_coordinates DOUBLE PRECISION[],
  location_area TEXT,
  attachments TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('inputs', 'equipment', 'tools', 'consumables', 'produce', 'parts', 'safety', 'office')),
  subcategory TEXT,
  name TEXT,
  description TEXT,
  brand TEXT,
  model TEXT,
  barcode TEXT,
  sku TEXT,
  quantity_current DOUBLE PRECISION,
  quantity_reserved DOUBLE PRECISION,
  quantity_available DOUBLE PRECISION,
  quantity_unit TEXT,
  quantity_minimum_stock DOUBLE PRECISION,
  quantity_maximum_stock DOUBLE PRECISION,
  cost_unit DOUBLE PRECISION,
  cost_total_value DOUBLE PRECISION,
  cost_currency TEXT DEFAULT 'ZMW',
  supplier_id TEXT,
  supplier_name TEXT,
  supplier_contact TEXT,
  supplier_email TEXT,
  supplier_address TEXT,
  location_warehouse TEXT,
  location_section TEXT,
  location_shelf TEXT,
  location_coordinates DOUBLE PRECISION[],
  date_purchase DATE,
  date_expiry DATE,
  date_last_used DATE,
  date_next_maintenance DATE,
  condition TEXT CHECK (condition IN ('new', 'good', 'fair', 'poor', 'damaged', 'expired')),
  status TEXT CHECK (status IN ('active', 'inactive', 'reserved', 'damaged', 'expired', 'disposed')),
  tags TEXT[],
  photos TEXT[],
  documents TEXT[],
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace items table
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_name TEXT,
  name TEXT,
  category TEXT CHECK (category IN ('inputs', 'produce')),
  type TEXT,
  description TEXT,
  price DOUBLE PRECISION,
  currency TEXT DEFAULT 'ZMW',
  quantity DOUBLE PRECISION,
  unit TEXT,
  province TEXT,
  district TEXT,
  images TEXT[],
  status TEXT CHECK (status IN ('available', 'sold', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  items JSONB,
  total_amount DOUBLE PRECISION,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_date DATE,
  payment_method TEXT CHECK (payment_method IN ('mobile_money', 'bank_transfer', 'cash_on_delivery')),
  payment_status TEXT CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
  delivery_full_name TEXT,
  delivery_phone TEXT,
  delivery_district TEXT,
  delivery_province TEXT,
  delivery_special_instructions TEXT,
  payment_mobile_number TEXT,
  payment_bank_account TEXT,
  payment_bank_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  province TEXT,
  district TEXT,
  date DATE,
  temperature_min DOUBLE PRECISION,
  temperature_max DOUBLE PRECISION,
  humidity DOUBLE PRECISION,
  rainfall DOUBLE PRECISION,
  wind_speed DOUBLE PRECISION,
  conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('crop_plan', 'input_recommendation', 'yield_forecast', 'price_prediction', 'pest_disease')),
  title TEXT,
  description TEXT,
  confidence DOUBLE PRECISION,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for users (users can only access their own data)
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for farms (users can only access their own farms)
CREATE POLICY "Users can view their own farms" ON farms
  FOR SELECT USING (farmer_id = auth.uid());

CREATE POLICY "Users can insert their own farms" ON farms
  FOR INSERT WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Users can update their own farms" ON farms
  FOR UPDATE USING (farmer_id = auth.uid());

CREATE POLICY "Users can delete their own farms" ON farms
  FOR DELETE USING (farmer_id = auth.uid());

-- Create policies for crops (users can only access crops from their own farms)
CREATE POLICY "Users can view crops from their own farms" ON crops
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = crops.farm_id AND farms.farmer_id = auth.uid()
  ));

-- Create policies for tasks (users can only access tasks from their own farms)
CREATE POLICY "Users can view tasks from their own farms" ON tasks
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = tasks.farm_id AND farms.farmer_id = auth.uid()
  ));

-- Create policies for inventory (users can only access inventory from their own farms)
CREATE POLICY "Users can view inventory from their own farms" ON inventory
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = inventory.farm_id AND farms.farmer_id = auth.uid()
  ));

-- Create policies for marketplace items (users can view all items, but only update their own)
CREATE POLICY "Users can view all marketplace items" ON marketplace_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own marketplace items" ON marketplace_items
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Users can update their own marketplace items" ON marketplace_items
  FOR UPDATE USING (seller_id = auth.uid());

-- Create policies for orders (customers can view their own orders)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Create policies for weather data (public read access)
CREATE POLICY "Public read access to weather data" ON weather_data
  FOR SELECT USING (true);

-- Create policies for AI recommendations (users can only access their own recommendations)
CREATE POLICY "Users can view their own AI recommendations" ON ai_recommendations
  FOR SELECT USING (user_id = auth.uid());

-- Grant necessary permissions to authenticated users
GRANT ALL ON TABLE users TO authenticated;
GRANT ALL ON TABLE farms TO authenticated;
GRANT ALL ON TABLE crops TO authenticated;
GRANT ALL ON TABLE tasks TO authenticated;
GRANT ALL ON TABLE inventory TO authenticated;
GRANT ALL ON TABLE marketplace_items TO authenticated;
GRANT ALL ON TABLE orders TO authenticated;
GRANT SELECT ON TABLE weather_data TO authenticated;
GRANT ALL ON TABLE ai_recommendations TO authenticated;

-- Grant usage on uuid-ossp extension
GRANT USAGE ON SCHEMA public TO authenticated;