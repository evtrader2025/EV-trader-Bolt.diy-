import React, { useState } from 'react';
import { Building2, Mail, Phone, Globe, FileText, User, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DealerRegistrationProps {
  onSuccess: () => void;
  onClose: () => void;
}

const IRISH_COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry',
  'Donegal', 'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry',
  'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford',
  'Louth', 'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon',
  'Sligo', 'Tipperary', 'Tyrone', 'Waterford', 'Westmeath',
  'Wexford', 'Wicklow'
];

const DEALERSHIP_TYPES = [
  'New Cars Only',
  'Used Cars Only',
  'EVs Only',
  'Multi-Brand',
  'Premium Brands',
  'Import Specialist'
];

const SUBSCRIPTION_PLANS = [
  { id: 'free', name: 'Free', description: 'Up to 5 listings' },
  { id: 'premium', name: 'Premium', description: 'Up to 50 listings, featured spots' },
  { id: 'pro', name: 'Pro', description: 'Unlimited listings, priority support' },
  { id: 'enterprise', name: 'Enterprise', description: 'Custom solutions for large dealers' }
];

export function DealerRegistration({ onSuccess, onClose }: DealerRegistrationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dealershipName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    county: '',
    eircode: '',
    website: '',
    registrationNumber: '',
    contactName: '',
    contactRole: '',
    dealershipType: '',
    averageListings: '10-50',
    listingFeatures: {
      photos: true,
      videos: false,
      threeSixty: false
    },
    subscriptionPlan: 'free',
    billingAddress: '',
    useSameAddress: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        listingFeatures: {
          ...prev.listingFeatures,
          [name]: checkbox.checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            user_type: 'dealer',
            full_name: formData.contactName,
          }]);

        if (profileError) throw profileError;

        const { error: dealershipError } = await supabase
          .from('dealerships')
          .insert([{
            profile_id: authData.user.id,
            name: formData.dealershipName,
            address: formData.address,
            city: formData.city,
            county: formData.county,
            eircode: formData.eircode,
            website: formData.website,
            contact_name: formData.contactName,
            contact_role: formData.contactRole,
            phone: formData.phone,
            dealership_type: formData.dealershipType,
            registration_number: formData.registrationNumber,
          }]);

        if (dealershipError) throw dealershipError;

        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Dealership Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="dealershipName"
                  value={formData.dealershipName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Business Registration Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Street Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  County
                </label>
                <select
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select County</option>
                  {IRISH_COUNTIES.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Eircode
                </label>
                <input
                  type="text"
                  name="eircode"
                  value={formData.eircode}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Website URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Person & Dealership Type</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Contact Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="contactRole"
                  value={formData.contactRole}
                  onChange={handleChange}
                  placeholder="e.g., Manager, Sales Representative"
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Dealership Type
              </label>
              <select
                name="dealershipType"
                value={formData.dealershipType}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Type</option>
                {DEALERSHIP_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Average Number of Listings
              </label>
              <select
                name="averageListings"
                value={formData.averageListings}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="1-10">1-10 vehicles</option>
                <option value="10-50">10-50 vehicles</option>
                <option value="50-100">50-100 vehicles</option>
                <option value="100+">100+ vehicles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Listing Features
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="photos"
                    checked={formData.listingFeatures.photos}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-800">Photo Gallery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="videos"
                    checked={formData.listingFeatures.videos}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-800">Video Walkaround</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="threeSixty"
                    checked={formData.listingFeatures.threeSixty}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-800">360° Interior View</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription Plan</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUBSCRIPTION_PLANS.map(plan => (
                <label
                  key={plan.id}
                  className={`
                    relative rounded-lg border p-4 cursor-pointer transition-colors
                    ${formData.subscriptionPlan === plan.id
                      ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="subscriptionPlan"
                    value={plan.id}
                    checked={formData.subscriptionPlan === plan.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-900">
                      {plan.name}
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">
                      {plan.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="useSameAddress"
                  checked={formData.useSameAddress}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    useSameAddress: e.target.checked,
                    billingAddress: e.target.checked ? prev.address : prev.billingAddress
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-800">
                  Use business address for billing
                </span>
              </label>
            </div>

            {!formData.useSameAddress && (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Billing Address
                </label>
                <textarea
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-xl">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dealer Registration</h1>
            
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between">
                {['Business Details', 'Address', 'Dealership Info', 'Subscription'].map((label, index) => (
                  <div
                    key={label}
                    className={`flex items-center ${index < step ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${index + 1 === step ? 'bg-blue-100 text-blue-600' : 
                        index + 1 < step ? 'bg-blue-600 text-white' : 'bg-gray-100'}
                    `}>
                      {index + 1 < step ? '✓' : index + 1}
                    </div>
                    <span className="ml-2 text-sm hidden sm:block">{label}</span>
                    {index < 3 && (
                      <div className={`w-full h-1 mx-4 ${
                        index + 1 < step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-gray-50 rounded-lg p-6">
                {renderStep()}
              </div>

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors ${
                    step === 1 ? 'ml-auto' : ''
                  }`}
                >
                  {loading ? 'Please wait...' : step === 4 ? 'Complete Registration' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
