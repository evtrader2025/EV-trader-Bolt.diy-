import React from 'react';
import { Filters } from './Filters';
import { VehicleList } from './VehicleList';

interface SearchResultsProps {
  onVehicleSelect: (vehicle: any) => void;
}

export function SearchResults({ onVehicleSelect }: SearchResultsProps) {
  const [filters, setFilters] = React.useState({
    price: { min: null, max: null },
    brand: null,
    year: { min: null, max: null },
    mileage: { min: null, max: null },
    range: { min: null, max: null },
    batteryCapacity: { min: null, max: null },
    features: [],
    condition: null
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button 
                onClick={() => setFilters({
                  price: { min: null, max: null },
                  brand: null,
                  year: { min: null, max: null },
                  mileage: { min: null, max: null },
                  range: { min: null, max: null },
                  batteryCapacity: { min: null, max: null },
                  features: [],
                  condition: null
                })}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
            <Filters onFilterChange={setFilters} />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <VehicleList 
            filters={filters}
            onVehicleSelect={onVehicleSelect}
          />
        </div>
      </div>
    </div>
  );
}
