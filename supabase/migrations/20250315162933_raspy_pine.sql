/*
  # Fix RLS policies for profiles table

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-create policies with proper permissions:
      - Insert: Allow authenticated users to create their own profile
      - Update: Allow users to update their own profile
      - Select: Allow users to view their own profile and public access
  
  2. Security
    - Maintains RLS protection
    - Ensures users can only modify their own data
    - Allows public read access for basic profile info
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Public read access to basic profile info" ON profiles;

-- Re-create policies
CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Public read access to basic profile info"
ON profiles
FOR SELECT
TO public
USING (true);
