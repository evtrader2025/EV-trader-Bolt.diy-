import React from 'react';
import { Battery, Zap, Timer, Calendar, MapPin, ArrowUpDown, Check, BatteryCharging } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';

interface VehicleListProps {
  filters: any;
  onVehicleSelect: (vehicle: any) => void;
}

export function VehicleList({ filters, onVehicleSelect }: VehicleListProps) {
  const { vehicles, loading, error, totalCount } = useVehicles(filters);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading vehicles: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Found {totalCount} Electric Vehicles
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex">
              <div className="w-1/3">
                <img
                  src={vehicle.images[0] || "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"}
                  alt={`${vehicle.brand.name} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {vehicle.brand.name} {vehicle.model} {vehicle.variant}
                    </h2>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Battery className="h-4 w-4 mr-1" />
                      {vehicle.battery_capacity} kWh
                      <span className="mx-2">•</span>
                      <Zap className="h-4 w-4 mr-1" />
                      {vehicle.power_output} kW
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">
                      {vehicle.available ? 'Available' : 'Sold'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center">
                    <BatteryCharging className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.charging_power} kW</p>
                      <p className="text-xs text-gray-500">Fast Charging</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.range_wltp} km</p>
                      <p className="text-xs text-gray-500">Range (WLTP)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Timer className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.acceleration} sec</p>
                      <p className="text-xs text-gray-500">0-100 km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.year}</p>
                      <p className="text-xs text-gray-500">Year</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                      <p className="text-xs text-gray-500">Mileage</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowUpDown className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{vehicle.power_output} kW</p>
                      <p className="text-xs text-gray-500">Power</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">€{vehicle.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Including VAT • Free Shipping</p>
                  </div>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                      Compare
                    </button>
                    <button 
                      onClick={() => onVehicleSelect(vehicle)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
