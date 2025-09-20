import React, { useState } from 'react';
import Api from '../api/axios';
import BookingDetails from './BookingDetails';
import { Search, MapPin, Calendar, Clock, Package, ShipWheel as Wheel, CheckCircle, AlertCircle } from 'lucide-react';

const SearchAndBook = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    capacityRequired: 0,
    fromPincode: '',
    toPincode: '',
    startDateTime: '',
  });
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [bookingVehicle, setBookingVehicle] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);

  const fetchVehicles = async () => {
    setIsSearching(true);
    setAvailableVehicles([]);
    setBookingMessage(null);

    try {
      const response = await Api.get('/api/vehicles/available', {
        params: {
          capacityRequired: searchCriteria.capacityRequired,
          fromPincode: searchCriteria.fromPincode,
          toPincode: searchCriteria.toPincode,
          startTime: searchCriteria.startDateTime,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('fleetlink_token')}`,
        },
      });

      setAvailableVehicles(response.data || []);
    } catch (error) {
      console.error('Search error:', error.response?.data || error.message);
      setBookingMessage({ type: 'error', text: 'Failed to search vehicles. Please try again.' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchVehicles();
  };

  const handleBooking = async (vehicleId) => {
    console.log('Booking vehicle:', vehicleId);
    setBookingVehicle(vehicleId);
    setBookingMessage(null);

    try {
      const bookingData = {
        vehicleId,
        fromPincode: searchCriteria.fromPincode,
        toPincode: searchCriteria.toPincode,
        startTime: searchCriteria.startDateTime,
        customerId: "cust001"
      };

      const response = await Api.post('/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('fleetlink_token')}`,
        },
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastBooking(response.data.booking);
      setBookingMessage({
        type: 'success',
        text: 'Vehicle booked successfully! Confirmation details sent to your email.'
      });

      await fetchVehicles();

    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      setBookingMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to book vehicle. Please try again.',
      });
    } finally {
      setBookingVehicle(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: name === 'capacityRequired' ? Number(value) : value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Search & Book Vehicles</h2>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="capacityRequired" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity Required (KG)
            </label>
            <input
              id="capacityRequired"
              name="capacityRequired"
              type="number"
              value={searchCriteria.capacityRequired || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Min capacity"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="fromPincode" className="block text-sm font-medium text-gray-700 mb-2">
              From Pincode
            </label>
            <input
              id="fromPincode"
              name="fromPincode"
              type="text"
              value={searchCriteria.fromPincode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="toPincode" className="block text-sm font-medium text-gray-700 mb-2">
              To Pincode
            </label>
            <input
              id="toPincode"
              name="toPincode"
              type="text"
              value={searchCriteria.toPincode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time
            </label>
            <input
              id="startDateTime"
              name="startDateTime"
              type="datetime-local"
              value={searchCriteria.startDateTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="lg:col-span-4">
            <button
              type="submit"
              disabled={isSearching}
              className="text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center"
              style={{ backgroundColor: '#0a66c2' }}
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              Search Vehicles
            </button>
          </div>
        </form>
      </div>

      {bookingMessage && (
        <div className={`p-4 rounded-lg flex items-center ${bookingMessage.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
          }`}>
          {bookingMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          )}
          <p className={`${bookingMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {bookingMessage.text}
          </p>
        </div>
      )}

      {availableVehicles.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Available Vehicles ({availableVehicles.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableVehicles.map((vehicle) => (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                  <div className="bg-blue-100 p-1 rounded">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <span>Capacity {vehicle.capacityKg} KG</span>
                  </div>
                  <div className="flex items-center">
                    <Wheel className="h-4 w-4 mr-2" />
                    <span>{vehicle.tyres} Tyres</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Est. Duration {vehicle.estimatedRideDurationHours}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(vehicle._id || vehicle.id)}
                  disabled={bookingVehicle === (vehicle._id || vehicle.id)}
                  className="w-full mt-3 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: '#0a66c2' }}
                >
                  {bookingVehicle === (vehicle._id || vehicle.id) ? "Booking..." : "Book Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {lastBooking && (
        <BookingDetails booking={lastBooking} />
      )}

      {availableVehicles.length === 0 && !isSearching && searchCriteria.capacityRequired > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No vehicles found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndBook;
