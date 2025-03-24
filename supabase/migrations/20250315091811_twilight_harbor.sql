/*
  # Initial Schema Setup

  1. Tables
    - profiles: User profiles with authentication
    - dealerships: Dealer information
    - brands: Car brands
    - features: Vehicle features
    - vehicles: Vehicle listings
    - vehicle_features: Junction table for vehicle features
  
  2. Security
    - Row Level Security enabled on all tables
    - Public read access where appropriate
    - User-specific write access
*/

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('admin', 'dealer', 'private')),
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_updated_at' 
    AND tgrelid = 'profiles'::regclass
  ) THEN
    EXECUTE 'CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at()';
  END IF;
END $$;

-- Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO public
  USING (auth.uid() = id);

-- Create dealerships table
CREATE TABLE IF NOT EXISTS dealerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  eircode text NOT NULL,
  address text NOT NULL,
  website text,
  logo_url text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dealerships_profile ON dealerships(profile_id);

ALTER TABLE dealerships ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_updated_at' 
    AND tgrelid = 'dealerships'::regclass
  ) THEN
    EXECUTE 'CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON dealerships
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at()';
  END IF;
END $$;

-- Policies for dealerships
DROP POLICY IF EXISTS "Dealerships are viewable by everyone" ON dealerships;
CREATE POLICY "Dealerships are viewable by everyone"
  ON dealerships FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Dealers can insert dealership" ON dealerships;
CREATE POLICY "Dealers can insert dealership"
  ON dealerships FOR INSERT
  TO public
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Dealers can update own dealership" ON dealerships;
CREATE POLICY "Dealers can update own dealership"
  ON dealerships FOR UPDATE
  TO public
  USING (auth.uid() = profile_id);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  country text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for brands" ON brands;
CREATE POLICY "Public read access for brands"
  ON brands FOR SELECT
  TO public
  USING (true);

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for features" ON features;
CREATE POLICY "Public read access for features"
  ON features FOR SELECT
  TO public
  USING (true);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id),
  model text NOT NULL,
  variant text,
  year integer NOT NULL,
  price numeric NOT NULL,
  mileage integer NOT NULL,
  battery_capacity numeric NOT NULL,
  range_wltp integer NOT NULL,
  charging_power integer NOT NULL,
  acceleration numeric NOT NULL,
  top_speed integer NOT NULL,
  power_output integer NOT NULL,
  color text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('New', 'Used')),
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  available boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vehicles_brand_id_idx ON vehicles(brand_id);
CREATE INDEX IF NOT EXISTS vehicles_price_idx ON vehicles(price);
CREATE INDEX IF NOT EXISTS vehicles_year_idx ON vehicles(year);
CREATE INDEX IF NOT EXISTS vehicles_range_wltp_idx ON vehicles(range_wltp);
CREATE INDEX IF NOT EXISTS vehicles_available_idx ON vehicles(available);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_updated_at' 
    AND tgrelid = 'vehicles'::regclass
  ) THEN
    EXECUTE 'CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON vehicles
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at()';
  END IF;
END $$;

DROP POLICY IF EXISTS "Public read access for vehicles" ON vehicles;
CREATE POLICY "Public read access for vehicles"
  ON vehicles FOR SELECT
  TO public
  USING (true);

-- Create vehicle_features junction table
CREATE TABLE IF NOT EXISTS vehicle_features (
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  feature_id uuid REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (vehicle_id, feature_id)
);

ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for vehicle features" ON vehicle_features;
CREATE POLICY "Public read access for vehicle features"
  ON vehicle_features FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO brands (name, country) VALUES
  ('Tesla', 'United States'),
  ('Porsche', 'Germany'),
  ('BMW', 'Germany'),
  ('Audi', 'Germany'),
  ('Mercedes-Benz', 'Germany'),
  ('Volkswagen', 'Germany'),
  ('Hyundai', 'South Korea'),
  ('Kia', 'South Korea'),
  ('Polestar', 'Sweden'),
  ('Volvo', 'Sweden')
ON CONFLICT (name) DO NOTHING;

INSERT INTO features (name, category) VALUES
  ('Adaptive Cruise Control', 'Safety'),
  ('Lane Keeping Assist', 'Safety'),
  ('360° Camera', 'Safety'),
  ('Blind Spot Monitor', 'Safety'),
  ('Heated Seats', 'Comfort'),
  ('Ventilated Seats', 'Comfort'),
  ('Panoramic Roof', 'Comfort'),
  ('Wireless Charging', 'Technology'),
  ('Apple CarPlay', 'Technology'),
  ('Android Auto', 'Technology'),
  ('Heat Pump', 'Efficiency'),
  ('Matrix LED Headlights', 'Safety'),
  ('Air Suspension', 'Comfort'),
  ('Premium Sound System', 'Entertainment')
ON CONFLICT (name) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (
  brand_id,
  model,
  variant,
  year,
  price,
  mileage,
  battery_capacity,
  range_wltp,
  charging_power,
  acceleration,
  top_speed,
  power_output,
  color,
  condition,
  images,
  available,
  featured
) 
SELECT 
  b.id,
  CASE b.name
    WHEN 'Tesla' THEN 'Model 3'
    WHEN 'Porsche' THEN 'Taycan'
    WHEN 'BMW' THEN 'i4'
    WHEN 'Audi' THEN 'e-tron GT'
    WHEN 'Mercedes-Benz' THEN 'EQS'
  END,
  'Performance',
  2024,
  CASE b.name
    WHEN 'Tesla' THEN 59900
    WHEN 'Porsche' THEN 89900
    WHEN 'BMW' THEN 69900
    WHEN 'Audi' THEN 79900
    WHEN 'Mercedes-Benz' THEN 99900
  END,
  0,
  CASE b.name
    WHEN 'Tesla' THEN 82
    WHEN 'Porsche' THEN 93.4
    WHEN 'BMW' THEN 84
    WHEN 'Audi' THEN 93.4
    WHEN 'Mercedes-Benz' THEN 107.8
  END,
  CASE b.name
    WHEN 'Tesla' THEN 507
    WHEN 'Porsche' THEN 484
    WHEN 'BMW' THEN 520
    WHEN 'Audi' THEN 488
    WHEN 'Mercedes-Benz' THEN 770
  END,
  CASE b.name
    WHEN 'Tesla' THEN 250
    WHEN 'Porsche' THEN 270
    WHEN 'BMW' THEN 200
    WHEN 'Audi' THEN 270
    WHEN 'Mercedes-Benz' THEN 200
  END,
  CASE b.name
    WHEN 'Tesla' THEN 3.3
    WHEN 'Porsche' THEN 2.8
    WHEN 'BMW' THEN 3.9
    WHEN 'Audi' THEN 3.3
    WHEN 'Mercedes-Benz' THEN 3.8
  END,
  CASE b.name
    WHEN 'Tesla' THEN 261
    WHEN 'Porsche' THEN 260
    WHEN 'BMW' THEN 250
    WHEN 'Audi' THEN 250
    WHEN 'Mercedes-Benz' THEN 250
  END,
  CASE b.name
    WHEN 'Tesla' THEN 340
    WHEN 'Porsche' THEN 460
    WHEN 'BMW' THEN 400
    WHEN 'Audi' THEN 440
    WHEN 'Mercedes-Benz' THEN 385
  END,
  'White',
  'New',
  '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"]',
  true,
  true
FROM brands b
WHERE b.name IN ('Tesla', 'Porsche', 'BMW', 'Audi', 'Mercedes-Benz');

-- Add features to vehicles
INSERT INTO vehicle_features (vehicle_id, feature_id)
SELECT v.id, f.id
FROM vehicles v
CROSS JOIN features f
WHERE f.name IN (
  'Adaptive Cruise Control',
  'Lane Keeping Assist',
  '360° Camera',
  'Heated Seats',
  'Panoramic Roof',
  'Wireless Charging',
  'Apple CarPlay',
  'Android Auto'
);
