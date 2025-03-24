import React, { useState } from 'react';
import { 
  Battery, 
  Zap, 
  Timer, 
  Calendar, 
  MapPin, 
  ArrowUpDown, 
  Car, 
  Shield, 
  Gauge,
  BatteryCharging,
  Info,
  Check,
  X
} from 'lucide-react';
import { TestDriveModal } from './TestDriveModal';

interface VehicleDetailsProps {
  vehicle: any;
  onClose: () => void;
  user?: any;
}

export function VehicleDetails({ vehicle, onClose, user }: VehicleDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);

  const specifications = [
    {
      id: 'acceleration',
      label: 'Acceleration (0-100 km/h)',
      value: `${vehicle.acceleration} sec`
    },
    {
      id: 'top_speed',
      label: 'Top Speed',
      value: `${vehicle.top_speed} km/h`
    },
    {
      id: 'drive_type',
      label: 'Drive Type',
      value: 'Electric'
    },
    {
      id: 'color',
      label: 'Color',
      value: vehicle.color
    },
    {
      id: 'charging_time',
      label: 'Charging Time (DC Fast)',
      value: '~30 min (10-80%)'
    },
    {
      id: 'battery_warranty',
      label: 'Battery Warranty',
      value: '8 years / 160,000 km'
    }
  ];

  // Ensure features array exists and has proper structure
  const features = vehicle.features?.map((feature: any, index: number) => ({
    ...feature,
    // Use feature.feature.id if available (from the join table), otherwise use index
    id: feature.feature?.id || feature.id || `feature-${index}`
  })) || [];

  const handleTestDriveClick = () => {
    if (!user) {
      // TODO: Show sign in modal
      alert('Please sign in to schedule a test drive');
      return;
    }
    setIsTestDriveModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to search results
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-[500px]">
            <img
              src={vehicle.images[activeImageIndex] || "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"}
              alt={`${vehicle.brand.name} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {vehicle.images.map((image: string, index: number) => (
                <button
                  key={`image-${index}-${image}`}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeImageIndex ? 'bg-blue-600' : 'bg-white'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {vehicle.brand.name} {vehicle.model} {vehicle.variant}
                </h1>
                <div className="mt-2 flex items-center space-x-4 text-gray-500">
                  <span>{vehicle.year}</span>
                  <span>•</span>
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                  <span>•</span>
                  <span>{vehicle.condition}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  €{vehicle.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Including VAT</p>
              </div>
            </div>

            {/* Key Specs */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center">
                <Battery className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Battery Capacity</p>
                  <p className="font-semibold">{vehicle.battery_capacity} kWh</p>
                </div>
              </div>
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Range (WLTP)</p>
                  <p className="font-semibold">{vehicle.range_wltp} km</p>
                </div>
              </div>
              <div className="flex items-center">
                <BatteryCharging className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Charging Power</p>
                  <p className="font-semibold">{vehicle.charging_power} kW</p>
                </div>
              </div>
              <div className="flex items-center">
                <Gauge className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Power Output</p>
                  <p className="font-semibold">{vehicle.power_output} kW</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Features & Equipment</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature: any) => (
                  <div key={feature.id} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature.feature?.name || feature.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {specifications.slice(0, 3).map(spec => (
                    <div key={`spec-${spec.id}`} className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {specifications.slice(3).map(spec => (
                    <div key={`spec-${spec.id}`} className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12 flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="text-xl font-semibold">Interested in this vehicle?</h3>
                <p className="text-gray-600 mt-1">Schedule a test drive or save for later</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <button
                  onClick={handleTestDriveClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule Test Drive
                </button>
                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Save to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {user && (
        <TestDriveModal
          isOpen={isTestDriveModalOpen}
          onClose={() => setIsTestDriveModalOpen(false)}
          vehicle={vehicle}
          userId={user.id}
        />
      )}
    </div>
  );
}
