"use client";
import React, { useState, useRef, useEffect } from "react";

const FlightBookingForm = () => {
  const [tripType, setTripType] = useState("one-way"); // Default to one-way
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("economy");
  const [originList, setOriginList] = useState([]);
  const [destList, setDestList] = useState([]);
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOriginList([]);
      setDestList([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call, data processing)
    console.log("Form submitted:", {
      tripType,
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      travelClass,
    });

    // https://www.makemytrip.com/flight/search?itinerary=BOM-PNQ-31/10/2024_PNQ-BOM-15/11/2024&tripType=R&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&ccde=IN&lang=eng
  };

  const placeHandler = async (key, value) => {
    const res = await fetch(
      `https://flights-cb.makemytrip.com/api/flights-search/autosuggest?limit=15&matchCity=true&query=${value}&region=in&language=eng&currency=inr`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Mcid: process.env.DEVICE_ID,
          Os: "DESKTOP",
          "app-ver": "1.0.0",
          "device-id": process.env.DEVICE_ID,
          Pfm: "DESKTOP",
          Src: "src",
        },
      }
    );
    const list = await res.json();
    if (key == "origin") {
      setOrigin({name: value, code: ""});
      if (list.results) setOriginList(list.results.SUGGESTIONS.data);
    } else {
      setDestination({name: value, code: ""});
      if (list.results) setDestList(list.results.SUGGESTIONS.data);
    }
  };

  const selectPosition = (which, name, code) => {
    if(which == "origin")
      setOrigin({name, code})
    else
      setDestination({name, code})
  }

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
              checked={tripType === "one-way"}
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
              checked={tripType === "round-trip"}
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
            value={origin?.name ?? ""}
            onChange={(e) => placeHandler("origin", e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded w-full"
            placeholder="Enter origin city"
            required
          />
          {originList.length > 0 && (
            <ul
              ref={modalRef}
              className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-35 mt-1 overflow-y-auto max-h-60" // Added overflow and max height
            >
              {originList.map((suggestion) => (
                <li
                  key={suggestion.iata}
                  onClick={() => selectPosition("origin", suggestion.cityName, suggestion.iata)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 group" // Added group class
                >
                  <div className="flex items-center">
                    <img
                      src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/ic-flight-onward.png"
                      alt="icon"
                      className="w-4 h-4" // Added icon size
                    />
                    <span className="ml-2 font-medium text-gray-800 group-hover:text-blue-500">
                      {" "}
                      {/* Added hover effect */}
                      {suggestion.cityName}
                    </span>
                    <span className="ml-auto text-gray-500 group-hover:text-blue-500">
                      {" "}
                      {/* Added hover effect */}({suggestion.iata})
                    </span>
                  </div>
                  {suggestion.airportName && (
                    <div className="text-sm text-gray-500 mt-1">
                      {suggestion.airportName}
                    </div>
                  )}
                  {suggestion.extraData && (
                    <div className="text-xs ml-4 text-yellow-500 mt-1">
                      {suggestion.extraData.tag.nearbyHeader.slice(22, 61)}
                      {suggestion.groupData &&
                        suggestion.groupData.length > 0 && (
                          <ul className="mt-1">
                            {" "}
                            {/* Changed to an unordered list */}
                            {suggestion.groupData.map((airport) => (
                              <li
                                key={airport.iata}
                                onClick={(event) => {
                                  event.stopPropagation(); // Prevent event bubbling
                                  selectPosition("origin", airport.cityName, airport.iata)
                                }}
                                className="flex items-center text-sm text-gray-500"
                              >
                                <div className="flex flex-col w-full mb-2">
                                  <div className="flex flex-row justify-between">
                                    <span>
                                      <img
                                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/ic-flight-onward.png"
                                        alt="icon"
                                        className="w-3 h-3 inline-block" // Smaller icon size
                                      />
                                      <span className="ml-2">{airport.airportName}</span>
                                    </span>
                                    <span>
                                      ({airport.iata})
                                    </span>
                                  </div>
                                  <div>{airport.distanceInfoText}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-1/2">
          <label htmlFor="destination" className="block mb-2">
            Destination:
          </label>
          <input
            type="text"
            id="destination"
            value={destination?.name ?? ""}
            onChange={(e) => placeHandler("dest", e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded w-full"
            placeholder="Enter destination city"
            required
          />
          {destList.length > 0 && (
            <ul
              ref={modalRef}
              className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md w-35 mt-1 overflow-y-auto max-h-60" // Added overflow and max height
            >
              {destList.map((suggestion) => (
                <li
                  key={suggestion.iata}
                  onClick={() => selectPosition("dest", suggestion.cityName, suggestion.iata)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 group" // Added group class
                >
                  <div className="flex items-center">
                    <img
                      src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/ic-flight-onward.png"
                      alt="icon"
                      className="w-4 h-4" // Added icon size
                    />
                    <span className="ml-2 font-medium text-gray-800 group-hover:text-blue-500">
                      {" "}
                      {/* Added hover effect */}
                      {suggestion.cityName}
                    </span>
                    <span className="ml-auto text-gray-500 group-hover:text-blue-500">
                      {" "}
                      {/* Added hover effect */}({suggestion.iata})
                    </span>
                  </div>
                  {suggestion.airportName && (
                    <div className="text-sm text-gray-500 mt-1">
                      {suggestion.airportName}
                    </div>
                  )}
                  {suggestion.extraData && (
                    <div className="text-xs ml-4 text-yellow-500 mt-1">
                      {suggestion.extraData.tag.nearbyHeader.slice(22, 61)}
                      {suggestion.groupData &&
                        suggestion.groupData.length > 0 && (
                          <ul className="mt-1">
                            {" "}
                            {/* Changed to an unordered list */}
                            {suggestion.groupData.map((airport) => (
                              <li
                                key={airport.iata}
                                onClick={(event) => {
                                  event.stopPropagation(); // Prevent event bubbling
                                  selectPosition("dest", airport.cityName, airport.iata)
                                }}
                                className="flex items-center text-sm text-gray-500"
                              >
                                <div className="flex flex-col w-full mb-2">
                                  <div className="flex flex-row justify-between">
                                    <span>
                                      <img
                                        src="https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/ic-flight-onward.png"
                                        alt="icon"
                                        className="w-3 h-3 inline-block" // Smaller icon size
                                      />
                                      <span className="ml-2">{airport.airportName}</span>
                                    </span>
                                    <span>
                                      ({airport.iata})
                                    </span>
                                  </div>
                                  <div>{airport.distanceInfoText}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
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
        {tripType === "round-trip" && (
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
