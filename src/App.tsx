import React, { useState, useEffect } from 'react';
import { Car, User, LogOut, ChevronDown, Battery, Zap, MapPin, Info, Shield } from 'lucide-react';
import { VehicleList } from './components/VehicleList';
import { VehicleDetails } from './components/VehicleDetails';
import { AuthModal } from './components/AuthModal';
import { DealerRegistration } from './components/DealerRegistration';
import { SellerRegistration } from './components/SellerRegistration';
import { RegistrationPage } from './components/RegistrationPage';
import { ProfileSettings } from './components/ProfileSettings';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { getCurrentUser, signOut } from './lib/auth';

type Page = 'home' | 'profile' | 'vehicle-details' | 'search-results' | 'register' | 'dealer-register' | 'seller-register';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { user, error } = await getCurrentUser();
    if (!error && user) {
      setUser(user);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      setUser(null);
      setCurrentPage('home');
    }
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedVehicle(null);
  };

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setCurrentPage('vehicle-details');
  };

  const handleSearch = () => {
    setCurrentPage('search-results');
  };

  const handleDropdownEnter = (dropdownId: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setDropdownOpen(dropdownId);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownOpen(null);
    }, 300);
    setDropdownTimeout(timeout);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'register':
        return (
          <RegistrationPage
            onDealerClick={() => setCurrentPage('dealer-register')}
            onSellerClick={() => setCurrentPage('seller-register')}
            onClose={navigateToHome}
          />
        );
      case 'dealer-register':
        return (
          <DealerRegistration
            onSuccess={() => {
              checkUser();
              navigateToHome();
            }}
            onClose={navigateToHome}
          />
        );
      case 'seller-register':
        return (
          <SellerRegistration
            onSuccess={() => {
              checkUser();
              navigateToHome();
            }}
            onClose={navigateToHome}
          />
        );
      case 'vehicle-details':
        return (
          <VehicleDetails 
            vehicle={selectedVehicle} 
            onClose={navigateToHome}
            user={user}
          />
        );
      case 'profile':
        return (
          <div className="pt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={navigateToHome}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
              >
                ← Back to Home
              </button>
              <ProfileSettings user={user} onUpdate={checkUser} />
            </div>
          </div>
        );
      case 'search-results':
        return <SearchResults onVehicleSelect={handleVehicleSelect} />;
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 pb-6 lg:pb-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16">
                <div className="text-center mb-8 lg:mb-12">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Your Journey to Electric Mobility Starts Here
                  </h1>
                  <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto">
                    Find your perfect electric vehicle and discover everything you need to know about EV ownership
                  </p>
                </div>

                {/* Search Form */}
                <div className="max-w-4xl mx-auto">
                  <SearchForm onSearch={handleSearch} />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Featured EVs */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Electric Vehicles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Featured car cards */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={`https://images.unsplash.com/photo-156095808${i}-b8a1929cea89?w=800`}
                        alt="Featured EV"
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">Featured Electric Car {i}</h3>
                        <p className="text-gray-600">Starting from €35,000</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* EV Guide Sections */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Battery className="h-8 w-8 text-green-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">EV Charging Guide</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Learn everything about EV charging, from home charging solutions to finding public charging stations.
                  </p>
                  <button className="text-green-600 font-medium hover:text-green-700">
                    Read the guide →
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-8 w-8 text-purple-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">EV Buyer's Guide</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Everything you need to know about buying an electric car, from range to running costs.
                  </p>
                  <button className="text-purple-600 font-medium hover:text-purple-700">
                    Read the guide →
                  </button>
                </div>
              </section>

              {/* Charging Network */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Charging Points</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-4">
                      {/* Map placeholder */}
                      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Find charging stations near you and plan your journey with our interactive map.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <h3 className="font-semibold mb-2">Fast Charging Network</h3>
                      <p className="text-sm text-gray-600">Access to over 5,000 fast charging points nationwide</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <h3 className="font-semibold mb-2">Home Charging</h3>
                      <p className="text-sm text-gray-600">Get advice on installing a home charging point</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <h3 className="font-semibold mb-2">Charging Partners</h3>
                      <p className="text-sm text-gray-600">Special offers from leading charging providers</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Why Choose an EV */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose an Electric Vehicle?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <Zap className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Lower Running Costs</h3>
                    <p className="text-gray-600 text-sm">Save money on fuel and maintenance with an electric vehicle</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <Shield className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Environmental Impact</h3>
                    <p className="text-gray-600 text-sm">Reduce your carbon footprint and help protect the environment</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <Battery className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Advanced Technology</h3>
                    <p className="text-gray-600 text-sm">Experience cutting-edge features and smart connectivity</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <Info className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Government Incentives</h3>
                    <p className="text-gray-600 text-sm">Take advantage of tax benefits and purchase incentives</p>
                  </div>
                </div>
              </section>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={navigateToHome}
              role="button"
              tabIndex={0}
            >
              <Car className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CarMarket</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div 
                className="relative"
                onMouseEnter={() => handleDropdownEnter('buy')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center text-gray-700 hover:text-blue-600">
                  Buy a Car
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className={`absolute w-48 bg-white shadow-lg rounded-lg mt-2 py-2 transition-opacity duration-200 ${
                  dropdownOpen === 'buy' ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">All Electric Cars</a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">New Cars</a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Used Cars</a>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentPage('register')}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                Sell Your Car
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setCurrentPage('profile')}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Profile
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          checkUser();
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
