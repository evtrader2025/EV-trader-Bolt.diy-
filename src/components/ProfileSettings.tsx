import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Building2, Mail, UserCircle } from 'lucide-react';

interface ProfileSettingsProps {
  user: any;
  onUpdate: () => void;
}

export function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  const [fullName, setFullName] = useState(user?.profile?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess(true);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center">
            <UserCircle className="h-20 w-20 text-white opacity-90" />
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-white">
                {fullName || 'Your Profile'}
              </h1>
              <p className="text-blue-100 mt-1">
                {user.profile?.user_type === 'dealer' ? 'Car Dealer' : 'Private User'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid gap-6">
            {/* Account Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Account Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="text-gray-900 capitalize">{user.profile?.user_type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Settings Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-600 text-sm">Profile updated successfully!</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </form>

            {/* Dealer-specific section */}
            {user.profile?.user_type === 'dealer' && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Dealership Information
                </h3>
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                  <p className="text-blue-600">
                    Set up your dealership profile to start listing vehicles.
                  </p>
                  <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded border border-blue-200 hover:bg-blue-50 transition-colors">
                    Configure Dealership
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
