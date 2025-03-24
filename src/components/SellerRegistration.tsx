import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, MessageSquare, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SellerRegistrationProps {
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

const NOTIFICATION_PREFERENCES = [
  { id: 'messages', label: 'New messages from buyers', defaultChecked: true },
  { id: 'offers', label: 'Offers on your listings', defaultChecked: true },
  { id: 'updates', label: 'Platform updates and news', defaultChecked: false },
  { id: 'tips', label: 'Selling tips and market insights', defaultChecked: true }
];

export function SellerRegistration({ onSuccess, onClose }: SellerRegistrationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    county: '',
    eircode: '',
    preferredContact: 'email',
    notifications: NOTIFICATION_PREFERENCES.reduce((acc, pref) => ({
      ...acc,
      [pref.id]: pref.defaultChecked
    }), {}),
    marketingConsent: false,
    acceptTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
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
            user_type: 'private',
            full_name: formData.fullName,
            contact_phone: formData.phone,
            address: formData.address,
            city: formData.city,
            county: formData.county,
            eircode: formData.eircode,
            preferred_contact: formData.preferredContact,
            notification_preferences: formData.notifications,
            marketing_consent: formData.marketingConsent
          }]);

        if (profileError) throw profileError;

        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Setup</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

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
                <p className="mt-1 text-sm text-gray-500">
                  Must be at least 8 characters long
                </p>
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
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

              <div className="grid grid-cols-2 gap-6">
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
                  Preferred Contact Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-800">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-800">Phone</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences & Terms</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-4">
                  Notification Preferences
                </label>
                <div className="space-y-3">
                  {NOTIFICATION_PREFERENCES.map(pref => (
                    <label key={pref.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name={`notifications.${pref.id}`}
                        checked={formData.notifications[pref.id]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [pref.id]: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-800">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-800">
                    I would like to receive marketing communications about relevant products and services
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-800">
                    I agree to the terms and conditions and privacy policy
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Private Seller Registration</h1>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between">
                {['Account Setup', 'Contact Info', 'Preferences'].map((label, index) => (
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
                    {index < 2 && (
                      <div className={`w-full h-1 mx-4 ${
                        index + 1 < step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="mt-4 text-lg font-medium text-gray-900">Registration Successful!</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Your account has been created successfully. You can now start listing your vehicles.
                </p>
              </div>
            ) : (
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
                    disabled={loading || (step === 3 && !formData.acceptTerms)}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center ${
                      step === 1 ? 'ml-auto' : ''
                    }`}
                  >
                    {loading ? 'Please wait...' : step === 3 ? 'Complete Registration' : 'Continue'}
                    {!loading && step < 3 && <ChevronRight className="ml-2 h-4 w-4" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
