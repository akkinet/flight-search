'use client'
import React, { useState } from 'react';

const FlightBookingForm = () => {
  const [tripType, setTripType] = useState('one-way'); // Default to one-way
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('economy');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call, data processing)
    console.log('Form submitted:', {
      tripType,
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      travelClass,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Book Your Flight</h2>

      {/* Trip Type */}
      <div className="mb-4">
        <label htmlFor="tripType" className="block mb-2">
          Trip Type:
        </label>
        <div className="flex">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              id="oneWay"
              value="one-way"
              checked={tripType === 'one-way'}
              onChange={(e) => setTripType(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">One-way</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              id="roundTrip"
              value="round-trip"
              checked={tripType === 'round-trip'}
              onChange={(e) => setTripType(e.target.value)}
              className="form-radio"
            />
            <span className="ml-2">Round-trip</span>
          </label>
        </div>
      </div>

      {/* Origin and Destination */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label htmlFor="origin" className="block mb-2">
            Origin:
          </label>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded w-full"
            placeholder="Enter origin city"
            required
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="destination" className="block mb-2">
            Destination:
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded w-full"
            placeholder="Enter destination city"
            required
          />
        </div>
      </div>

      {/* Departure and Return Dates */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label htmlFor="departureDate" className="block mb-2">
            Departure Date:
          </label>
          <input
            type="date"
            id="departureDate"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded w-full"
            required
          />
        </div>
        {tripType === 'round-trip' && (
          <div className="w-1/2">
            <label htmlFor="returnDate" className="block mb-2">
              Return Date:
            </label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="border border-gray-400 px-3 py-2 rounded w-full"
              required
            />
          </div>
        )}
      </div>

      {/* Passengers and Travel Class */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label htmlFor="passengers" className="block mb-2">
            Passengers:
          </label>
          <select
            id="passengers"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
            className="border border-gray-400 px-3 py-2 rounded w-full"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <label htmlFor="travelClass" className="block mb-2">
            Travel Class:
          </label>
          <select
            id="travelClass"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded w-full"
          >
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Search Flights
      </button>
    </form>
  );
};

export default FlightBookingForm;