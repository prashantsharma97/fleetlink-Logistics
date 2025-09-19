import React from 'react';
import { Truck, MapPin, Clock, CheckCircle, User, Hash } from 'lucide-react';

const BookingDetails = ({ booking }) => {
  if (!booking) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No booking selected</p>
          <p className="text-sm">Booking details will appear here after a successful booking</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-2 rounded-lg mr-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">Booking Confirmed</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Hash className="h-5 w-5 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Booking ID</p>
              <p className="text-gray-900 font-mono text-sm">{booking._id}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Truck className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Vehicle ID</p>
              <p className="text-gray-900 font-mono text-sm">{booking.vehicleId}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Customer ID</p>
              <p className="text-gray-900 font-mono text-sm">{booking.customerId}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Route</p>
              <p className="text-gray-900">
                {booking.fromPincode} → {booking.toPincode}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Start Time</p>
              <p className="text-gray-900">{formatDateTime(booking.startTime)}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">End Time</p>
              <p className="text-gray-900">{formatDateTime(booking.endTime)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-green-700 font-medium">
            Booking confirmed successfully! You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
