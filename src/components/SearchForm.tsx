import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SearchFormProps {
  onSearch: () => void;
}

interface Brand {
  id: string;
  name: string;
  models: string[];
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [searchType, setSearchType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('50');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand);
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedBrand]);

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name')
      .order('name');

    if (!error && data) {
      setBrands(data);
    }
  };

  const fetchModels = async (brandId: string) => {
    // Using a subquery to get distinct models
    const { data, error } = await supabase
      .from('vehicles')
      .select('model')
      .eq('brand_id', brandId);

    if (!error && data) {
      // Get unique models using Set
      const uniqueModels = [...new Set(data.map(item => item.model))].sort();
      setModels(uniqueModels);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What are you looking for?
          </label>
          <div className="relative">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            >
              <option value="all">All electric cars</option>
              <option value="new">New cars</option>
              <option value="used">Used cars</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Model (shows only when brand is selected) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md disabled:bg-gray-100"
            >
              <option value="">All Models</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Eircode"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Search className="h-5 w-5 mr-2" />
          Search Cars
        </button>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {brands.slice(0, 4).map(brand => (
          <button
            key={brand.id}
            type="button"
            onClick={() => setSelectedBrand(brand.id)}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${
              selectedBrand === brand.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>
    </form>
  );
}
