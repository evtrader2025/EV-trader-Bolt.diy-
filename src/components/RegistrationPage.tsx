import React from 'react';
import { Building2, User, ArrowRight, Shield, BarChart as ChartBar, MessageSquare, Settings, Users, Zap } from 'lucide-react';

interface RegistrationPageProps {
  onDealerClick: () => void;
  onSellerClick: () => void;
  onClose: () => void;
}

export function RegistrationPage({ onDealerClick, onSellerClick, onClose }: RegistrationPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-900 py-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=2000"
            alt="Electric vehicles"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Join Ireland's Premier EV Marketplace
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Whether you're a dealership or private seller, we have the perfect solution for you to reach EV buyers across Ireland.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Registration Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Dealer Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1562238074-f49a29137ce1?auto=format&fit=crop&q=80&w=1000"
                  alt="Car dealership"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-blue-600 rounded-lg p-3 inline-block mb-4">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Dealer Account</h2>
                  <p className="text-blue-100 mt-2">For professional car dealerships</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ChartBar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Advanced Analytics</h3>
                      <p className="text-gray-600">Track performance and market insights</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Multiple Users</h3>
                      <p className="text-gray-600">Team account management</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Verified Status</h3>
                      <p className="text-gray-600">Enhanced trust and visibility</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Advanced Tools</h3>
                      <p className="text-gray-600">Inventory management system</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onDealerClick}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center text-lg font-semibold"
                >
                  Register as Dealer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Private Seller Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000"
                  alt="Private seller"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="bg-purple-600 rounded-lg p-3 inline-block mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Private Seller</h2>
                  <p className="text-purple-100 mt-2">For individual car owners</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Quick Setup</h3>
                      <p className="text-gray-600">List your car in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Direct Messages</h3>
                      <p className="text-gray-600">Connect with buyers easily</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Secure Payments</h3>
                      <p className="text-gray-600">Safe and protected transactions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ChartBar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Market Insights</h3>
                      <p className="text-gray-600">Know your car's value</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onSellerClick}
                  className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center text-lg font-semibold"
                >
                  Register as Private Seller
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center mx-auto"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
