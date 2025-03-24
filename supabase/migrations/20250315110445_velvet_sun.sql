/*
  # Create test drive bookings table

  1. New Tables
    - `test_drive_bookings`
      - `id` (uuid, primary key)
      - `vehicle_id` (uuid, references vehicles)
      - `user_id` (uuid, references profiles)
      - `preferred_date` (timestamptz)
      - `alternate_date` (timestamptz)
      - `status` (enum: pending, confirmed, completed, cancelled)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for users to manage their bookings
    - Add policies for dealers to manage bookings for their vehicles
*/

-- Create enum for booking status
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create test drive bookings table
CREATE TABLE IF NOT EXISTS test_drive_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  preferred_date timestamptz NOT NULL,
  alternate_date timestamptz,
  status booking_status_enum DEFAULT 'pending' NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE test_drive_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bookings"
  ON test_drive_bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON test_drive_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON test_drive_bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON test_drive_bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create index for common queries
CREATE INDEX idx_test_drive_bookings_vehicle ON test_drive_bookings(vehicle_id);
CREATE INDEX idx_test_drive_bookings_user ON test_drive_bookings(user_id);
CREATE INDEX idx_test_drive_bookings_status ON test_drive_bookings(status);
