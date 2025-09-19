import React, { useState } from 'react';
import Api from '../api/axios';
import { Truck, Package, ShipWheel as Wheel, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 0,
    tyres: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await Api.post(
        '/api/vehicles',
        {
          name: formData.name,
          capacityKg: Number(formData.capacity), 
          tyres: Number(formData.tyres),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('fleetlink_token')}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage({ type: 'success', text: 'Vehicle added successfully!' });
        setFormData({ name: '', capacity: 0, tyres: 4 });
      }
    } catch (error) {
      console.error('Vehicle add error:', error.response?.data || error.message);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to add vehicle. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' || name === 'tyres' ? Number(value) : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Add New Vehicle</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="Enter vehicle name"
              required
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Capacity (KG)
              </div>
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              placeholder="Enter capacity in KG"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="tyres" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Wheel className="h-4 w-4 mr-2" />
                Number of Tyres
              </div>
            </label>
            <select
              id="tyres"
              name="tyres"
              value={formData.tyres}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              required
            >
              <option value="">Select</option>
              <option value={2}>2 Tyres</option>
              <option value={4}>4 Tyres</option>
              <option value={6}>6 Tyres</option>
              <option value={8}>8 Tyres</option>
              <option value={10}>10 Tyres</option>
              <option value={12}>12 Tyres</option>
            </select>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg flex items-center ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message.text}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            style={{ backgroundColor: '#0a66c2' }}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add Vehicle
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
