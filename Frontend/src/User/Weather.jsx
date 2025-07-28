import React, { useState, useEffect } from "react";

const Weather = ({ showNotification }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(""); // This is for the search input
  const [userDetectedLocation, setUserDetectedLocation] = useState(""); // What geolocation + API detected
  const [loading, setLoading] = useState(false); // State for local loading (initially false)
  const [error, setError] = useState(null); // State for local error
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); // To ensure geolocation only runs once
  const [geolocationStatus, setGeolocationStatus] = useState(null); // 'detecting', 'success', 'failed', 'denied'

  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const WEATHER_API_URL =
    import.meta.env.VITE_WEATHER_API_URL || "https://api.weatherapi.com/v1";

  // Function to fetch weather data for a given location (used by both auto-detect and manual search)
  const fetchWeather = async (loc, isInitialGeolocation = false) => {
    if (!loc.trim()) {
      if (!isInitialGeolocation) {
        showNotification("Please enter a location.", "warning");
      }
      return;
    }
    if (
      !WEATHER_API_KEY ||
      WEATHER_API_KEY === "YOUR_WEATHERAPI_COM_KEY_HERE"
    ) {
      setError(
        "Weather API Key is not configured. Please add it to your .env file."
      );
      showNotification("Weather API Key is not configured.", "error");
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    if (!isInitialGeolocation) {
      setWeatherData(null); // Clear previous weather data for manual search
      setUserDetectedLocation(""); // Clear detected location when manually searching
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 15000); // 15 seconds API fetch timeout

      const response = await fetch(
        `${WEATHER_API_URL}/current.json?key=${WEATHER_API_KEY}&q=${loc}`,
        { signal: controller.signal }
      );
      clearTimeout(id); // Clear fetch timeout

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}: ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      setWeatherData(data);

      if (isInitialGeolocation) {
        setUserDetectedLocation(data.location.name);
        setGeolocationStatus("success");
        showNotification(
          `Current location weather for ${data.location.name} loaded!`,
          "success"
        );
      } else {
        showNotification(
          `Weather for ${data.location.name} loaded!`,
          "success"
        );
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Weather data fetch timed out. Please try again.");
        showNotification("Weather data fetch timed out.", "error");
      } else {
        setError(
          err.message || "Failed to fetch weather data. Please try again."
        );
        showNotification(
          err.message || "Failed to fetch weather data.",
          "error"
        );
      }
      // If it's the initial geolocation attempt and it fails
      if (isInitialGeolocation) {
        setGeolocationStatus("failed");
      }
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  // Effect to get user's current location on component mount
  useEffect(() => {
    if (initialLoadAttempted) return; // Prevent running multiple times
    setInitialLoadAttempted(true); // Mark as attempted

    if (
      WEATHER_API_KEY &&
      WEATHER_API_KEY !== "YOUR_WEATHERAPI_COM_KEY_HERE" &&
      navigator.geolocation
    ) {
      setLoading(true);
      setError(null);
      setGeolocationStatus("detecting");

      // Use a Promise to handle both geolocation success and error,
      // and ensure loading state is managed robustly.
      new Promise((resolve, reject) => {
        const geoTimeout = setTimeout(() => {
          reject(new GeolocationPositionError(3, "Geolocation timed out."));
        }, 25000); // Global timeout for getting permission/position

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(geoTimeout);
            resolve(position);
          },
          (geoError) => {
            clearTimeout(geoTimeout);
            reject(geoError);
          },
          {
            timeout: 20000, // Timeout for getting actual position
            enableHighAccuracy: true,
            maximumAge: 0,
          }
        );
      })
        .then(async (position) => {
          // Geolocation successful, now fetch weather
          const latLon = `${position.coords.latitude},${position.coords.longitude}`;
          await fetchWeather(latLon, true); // Use the common fetchWeather function
        })
        .catch((geoError) => {
          // Geolocation request itself failed (denied, unavailable, timed out)
          console.error("Geolocation error in useEffect:", geoError);
          let msg = "Geolocation Error: ";
          if (geoError.code === 1) msg += "Permission Denied.";
          else if (geoError.code === 2) msg += "Position Unavailable.";
          else if (geoError.code === 3) msg += "Timed Out.";
          else msg += geoError.message || "Unknown error.";

          setLocationDenied(true); // Indicate geolocation was denied/failed
          setGeolocationStatus("failed");
          setError(msg + " Please allow location access or search manually.");
          showNotification("Geolocation failed.", "warning");
        })
        .finally(() => {
          setLoading(false); // Ensure loading is off after initial attempt
        });
    } else if (
      !WEATHER_API_KEY ||
      WEATHER_API_KEY === "YOUR_WEATHERAPI_COM_KEY_HERE"
    ) {
      setError(
        "Weather API Key not configured. Please add it to your .env file."
      );
      setGeolocationStatus("failed");
    } else {
      setError("Geolocation is not supported by your browser.");
      setGeolocationStatus("failed");
    }
  }, [
    showNotification,
    WEATHER_API_KEY,
    WEATHER_API_URL,
    initialLoadAttempted,
  ]);

  const handleSearch = () => {
    // Check if currently loading something before allowing new search
    if (loading) {
      showNotification("Already loading weather. Please wait.", "info");
      return;
    }
    fetchWeather(location);
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
    setError(null); // Clear errors when user starts typing
    setWeatherData(null); // Clear displayed weather if user starts typing a new search
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Weather Forecast</h2>

        <p className="text-lg mb-6 text-gray-300">
          {geolocationStatus === "detecting"
            ? "Detecting current location..."
            : userDetectedLocation
            ? `Current Location: ${userDetectedLocation}. Not correct? Search manually below.`
            : geolocationStatus === "failed" || error
            ? "Geolocation failed. Enter a city below."
            : "Enter city to search for weather."}
        </p>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={location}
            onChange={handleInputChange}
            placeholder="Enter city name"
            className="p-2 rounded-l-lg border border-gray-700 focus:ring-2 focus:ring-green-400 text-gray-300 bg-gray-700 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-r-lg transition-all duration-300 ml-0.5"
            disabled={loading} // Disable button if loading
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {weatherData && (
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg border border-gray-600 text-left">
            <h3 className="text-2xl font-bold mb-2 text-white">
              Weather for {weatherData.location.name},{" "}
              {weatherData.location.country}
            </h3>
            <p className="text-xl text-green-400 mb-2">
              Temperature: {weatherData.current.temp_c}°C
            </p>
            <p className="text-gray-300 text-lg mb-1">
              Humidity: {weatherData.current.humidity}%
            </p>
            <p className="text-gray-300 text-lg mb-1">
              Wind Speed: {weatherData.current.wind_kph} kph
            </p>
            <p className="text-gray-300 text-lg mb-1">
              Pressure: {weatherData.current.pressure_mb} hPa
            </p>
            <p className="text-gray-300 text-lg mb-1">
              Visibility: {weatherData.current.vis_km} km
            </p>
            <p className="text-gray-300 text-lg">
              Description: {weatherData.current.condition.text}
            </p>
            <p className="text-gray-300 text-lg">
              Local Time: {weatherData.location.localtime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
