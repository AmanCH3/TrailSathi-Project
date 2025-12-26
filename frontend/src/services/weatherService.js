import api from '../api/api';

export const getWeather = async (city) => {
  try {
    const response = await api.get(`/weather?city=${city}`);
    return response.data;
  } catch (error) {
    console.error('Weather Service Error:', error);
    if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch weather data');
  }
};
