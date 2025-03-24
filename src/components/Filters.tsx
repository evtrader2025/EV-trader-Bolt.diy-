import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  price: { min: number | null; max: number | null };
  brand: string | null;
  year: { min: number | null; max: number | null };
  mileage: { min: number | null; max: number | null };
  range: { min: number | null; max: number | null };
  batteryCapacity: { min: number | null; max: number | null };
  features: string[];
  condition: string | null;
}

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [features, setFeatures] = useState<{ id: string; name: string; category: string }[]>([]);
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'price', title: 'Price Range', isOpen: true },
    { id: 'brand', title: 'Brand', isOpen: true },
    { id: 'year', title: 'Year', isOpen: true },
    { id: 'mileage', title: 'Mileage', isOpen: false },
    { id: 'range', title: 'Range', isOpen: false },
    { id: 'battery', title: 'Battery', isOpen: false },
    { id: 'features', title: 'Features', isOpen: false },
  ]);
  
  const [filters, setFilters] = useState<FilterState>({
    price: { min: null, max: null },
    brand: null,
    year: { min: null, max: null },
    mileage: { min: null, max: null },
    range: { min: null, max: null },
    batteryCapacity: { min: null, max: null },
    features: [],
    condition: null
  });

  useEffect(() => {
    fetchBrandsAndFeatures();
  }, []);

  const fetchBrandsAndFeatures = async () => {
    const [brandsResponse, featuresResponse] = await Promise.all([
      supabase.from('brands').select('id, name').order('name'),
      supabase.from('features').select('id, name, category').order('category, name')
    ]);

    if (brandsResponse.data) setBrands(brandsResponse.data);
    if (featuresResponse.data) setFeatures(featuresResponse.data);
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isOpen: !section.isOpen }
        : section
    ));
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.id} className="border-b pb-4 last:border-b-0 last:pb-0">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex justify-between items-center w-full text-left mb-4"
          >
            <span className="font-medium text-gray-900">{section.title}</span>
            {section.isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {section.isOpen && (
            <div className="space-y-4">
              {section.id === 'price' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.price.min || ''}
                    onChange={(e) => handleFilterChange('price', { 
                      ...filters.price, 
                      min: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.price.max || ''}
                    onChange={(e) => handleFilterChange('price', { 
                      ...filters.price, 
                      max: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {section.id === 'brand' && (
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand.id} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        checked={filters.brand === brand.id}
                        onChange={() => handleFilterChange('brand', brand.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">{brand.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {section.id === 'year' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    value={filters.year.min || ''}
                    onChange={(e) => handleFilterChange('year', { 
                      ...filters.year, 
                      min: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.year.max || ''}
                    onChange={(e) => handleFilterChange('year', { 
                      ...filters.year, 
                      max: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {section.id === 'mileage' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min km"
                    value={filters.mileage.min || ''}
                    onChange={(e) => handleFilterChange('mileage', { 
                      ...filters.mileage, 
                      min: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max km"
                    value={filters.mileage.max || ''}
                    onChange={(e) => handleFilterChange('mileage', { 
                      ...filters.mileage, 
                      max: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {section.id === 'range' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min km"
                    value={filters.range.min || ''}
                    onChange={(e) => handleFilterChange('range', { 
                      ...filters.range, 
                      min: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max km"
                    value={filters.range.max || ''}
                    onChange={(e) => handleFilterChange('range', { 
                      ...filters.range, 
                      max: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {section.id === 'battery' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min kWh"
                    value={filters.batteryCapacity.min || ''}
                    onChange={(e) => handleFilterChange('batteryCapacity', { 
                      ...filters.batteryCapacity, 
                      min: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max kWh"
                    value={filters.batteryCapacity.max || ''}
                    onChange={(e) => handleFilterChange('batteryCapacity', { 
                      ...filters.batteryCapacity, 
                      max: e.target.value ? Number(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {section.id === 'features' && (
                <div className="space-y-2">
                  {features.map(feature => (
                    <label key={feature.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature.id)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...filters.features, feature.id]
                            : filters.features.filter(id => id !== feature.id);
                          handleFilterChange('features', newFeatures);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">{feature.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
