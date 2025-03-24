import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Vehicle {
  id: string;
  brand: { name: string };
  model: string;
  variant: string;
  year: number;
  price: number;
  mileage: number;
  battery_capacity: number;
  range_wltp: number;
  charging_power: number;
  acceleration: number;
  top_speed: number;
  power_output: number;
  color: string;
  condition: string;
  images: string[];
  available: boolean;
  features: { name: string }[];
}

interface Filters {
  price: { min: number | null; max: number | null };
  brand: string | null;
  year: { min: number | null; max: number | null };
  mileage: { min: number | null; max: number | null };
  range: { min: number | null; max: number | null };
  batteryCapacity: { min: number | null; max: number | null };
  features: string[];
  condition: string | null;
}

export function useVehicles(filters: Filters) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('vehicles')
        .select(`
          *,
          brand:brand_id(name),
          features:vehicle_features(feature:feature_id(name))
        `, { count: 'exact' });

      // Apply filters
      if (filters.price.min) query = query.gte('price', filters.price.min);
      if (filters.price.max) query = query.lte('price', filters.price.max);
      if (filters.brand) query = query.eq('brand_id', filters.brand);
      if (filters.year.min) query = query.gte('year', filters.year.min);
      if (filters.year.max) query = query.lte('year', filters.year.max);
      if (filters.mileage.min) query = query.gte('mileage', filters.mileage.min);
      if (filters.mileage.max) query = query.lte('mileage', filters.mileage.max);
      if (filters.range.min) query = query.gte('range_wltp', filters.range.min);
      if (filters.range.max) query = query.lte('range_wltp', filters.range.max);
      if (filters.batteryCapacity.min) query = query.gte('battery_capacity', filters.batteryCapacity.min);
      if (filters.batteryCapacity.max) query = query.lte('battery_capacity', filters.batteryCapacity.max);
      if (filters.condition) query = query.eq('condition', filters.condition);
      
      if (filters.features.length > 0) {
        query = query.contains('features', filters.features);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setVehicles(data || []);
      if (count !== null) setTotalCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { vehicles, loading, error, totalCount };
}
