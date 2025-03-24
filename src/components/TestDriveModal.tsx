import React, { useState } from 'react';
import { Calendar, Clock, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
  userId: string;
}

export function TestDriveModal({ isOpen, onClose, vehicle, userId }: TestDriveModalProps) {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [alternateDate, setAlternateDate] = useState('');
  const [alternateTime, setAlternateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Combine date and time
      const preferredDateTime = new Date(`${preferredDate}T${preferredTime}`);
      const alternateDateTime = alternateDate && alternateTime
        ? new Date(`${alternateDate}T${alternateTime}`)
        : null;

      const { error: bookingError } = await supabase
        .from('test_drive_bookings')
        .insert([
          {
            vehicle_id: vehicle.id,
            user_id: userId,
            preferred_date: preferredDateTime.toISOString(),
            alternate_date: alternateDateTime?.toISOString(),
            notes,
            status: 'pending'
          }
        ]);

      if (bookingError) throw bookingError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Reset form
        setPreferredDate('');
        setPreferredTime('');
        setAlternateDate('');
        setAlternateTime('');
        setNotes('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book test drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Schedule Test Drive
          </h2>
          <p className="text-gray-600 mb-6">
            {vehicle.brand.name} {vehicle.model} {vehicle.variant}
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
              <p className="text-green-600 font-medium">
                Test drive request submitted successfully!
              </p>
              <p className="text-green-500 text-sm mt-1">
                We'll contact you to confirm the appointment.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Preferred Date/Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date & Time
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      required
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Alternate Date/Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Date & Time (Optional)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={alternateDate}
                      onChange={(e) => setAlternateDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={alternateTime}
                      onChange={(e) => setAlternateTime(e.target.value)}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Any specific questions or requirements?"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Submitting...' : 'Schedule Test Drive'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
