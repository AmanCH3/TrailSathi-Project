import React, { useEffect, useState } from 'react';
import { getWeather } from '../../services/weatherService';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Loader2 } from 'lucide-react';

const WeatherWidget = ({ city = 'Kathmandu' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeather(city);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  if (loading) return <div className="flex items-center text-sm text-gray-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading weather...</div>;
  if (error) return <div className="text-xs text-red-500">Weather unavailable</div>;
  if (!weather) return null;

  const { main, weather: weatherDetails, name } = weather;
  const temp = Math.round(main.temp);
  const condition = weatherDetails[0]?.main;

  const getIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'clouds': return <Cloud className="h-5 w-5 text-gray-400" />;
      case 'rain': 
      case 'drizzle': return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'snow': return <CloudSnow className="h-5 w-5 text-blue-200" />;
      case 'thunderstorm': return <CloudLightning className="h-5 w-5 text-purple-500" />;
      default: return <Cloud className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
      {getIcon(condition)}
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold text-gray-800">{temp}°C</span>
        <span className="text-[10px] text-gray-500">{name}</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
