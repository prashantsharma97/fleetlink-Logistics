import React, { useEffect, useState } from "react";
import Api from "../api/axios";
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const id = "cust001"; 
        const res = await Api.get(`/api/bookings-details?customerId=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("fleetlink_token")}`,
          },
        });
        setBookings(res.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage({ type: "error", text: "Failed to fetch bookings" });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setMessage(null);

    try {
      const res = await Api.delete(`/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("fleetlink_token")}`,
        },
      });

      if (res.status === 200) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setMessage({ type: "success", text: "Booking cancelled successfully" });
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      setMessage({ type: "error", text: "Failed to cancel booking" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <Truck className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">My Bookings</h2>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center ${
            message.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          )}
          <p
            className={
              message.type === "success" ? "text-green-700" : "text-red-700"
            }
          >
            {message.text}
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading bookings...</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 flex items-center mb-3">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                Vehicle: {booking.vehicleId?.name} (
                {booking.vehicleId?.capacityKg} KG,{" "}
                {booking.vehicleId?.tyres} tyres)
              </h3>

              <div className="text-sm text-gray-600 space-y-2 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {booking.fromPincode} → {booking.toPincode}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(booking.startTime).toLocaleString()} →{" "}
                    {new Date(booking.endTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Customer: {booking.customerId}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(booking._id)}
                disabled={deletingId === booking._id}
                className="w-full flex items-center justify-center text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: "#e74c3c" }}
              >
                {deletingId === booking._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 mr-2" />
                    Cancel Booking
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
          No bookings found.
        </div>
      )}
    </div>
  );
};

