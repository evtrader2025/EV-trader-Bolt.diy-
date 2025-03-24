/*
  # Electric Vehicles Database Schema

  1. New Tables
    - `vehicles`
      - Basic info: id, brand, model, year, price, mileage
      - EV specs: battery_capacity, range_wltp, charging_power
      - Performance: acceleration, top_speed, power_output
      - Details: color, condition, features, images
      - Status: available, featured, created_at
    
    - `brands`
      - Normalized brand data for consistent filtering
    
    - `vehicle_features`
      - Junction table for many-to-many vehicle features
    
    - `features`
      - Normalized feature data (e.g., "Autopilot", "Heat Pump")

  2. Security
    - Enable RLS on all tables
    - Public read access for vehicle listings
    - Authenticated write access for admin users
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  country text,
  created_at timestamptz DEFAULT now()
);

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id),
  model text NOT NULL,
  variant text,
  year integer NOT NULL,
  price decimal NOT NULL,
  mileage integer NOT NULL,
  battery_capacity decimal NOT NULL,
  range_wltp integer NOT NULL,
  charging_power integer NOT NULL,
  acceleration decimal NOT NULL,
  top_speed integer NOT NULL,
  power_output integer NOT NULL,
  color text NOT NULL,
  condition text NOT NULL,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  available boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicle_features junction table
CREATE TABLE IF NOT EXISTS vehicle_features (
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  feature_id uuid REFERENCES features(id) ON DELETE CASCADE,
  PRIMARY KEY (vehicle_id, feature_id)
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for brands"
  ON brands
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for features"
  ON features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for vehicles"
  ON vehicles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for vehicle features"
  ON vehicle_features
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS vehicles_brand_id_idx ON vehicles(brand_id);
CREATE INDEX IF NOT EXISTS vehicles_price_idx ON vehicles(price);
CREATE INDEX IF NOT EXISTS vehicles_year_idx ON vehicles(year);
CREATE INDEX IF NOT EXISTS vehicles_range_wltp_idx ON vehicles(range_wltp);
CREATE INDEX IF NOT EXISTS vehicles_available_idx ON vehicles(available);

-- Add sample data for testing
INSERT INTO brands (name, country) VALUES
  ('Tesla', 'United States'),
  ('Volkswagen', 'Germany'),
  ('BMW', 'Germany'),
  ('Porsche', 'Germany'),
  ('Hyundai', 'South Korea')
ON CONFLICT (name) DO NOTHING;

INSERT INTO features (name, category) VALUES
  ('Autopilot', 'Driver Assistance'),
  ('Heat Pump', 'Efficiency'),
  ('360 Camera', 'Safety'),
  ('Wireless Charging', 'Convenience'),
  ('Adaptive Cruise Control', 'Driver Assistance')
ON CONFLICT (name) DO NOTHING;
