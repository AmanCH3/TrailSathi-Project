const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    console.log('Weather Controller: Fetching weather for', city);
    const queryCity = city || 'Kathmandu';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error('Weather Controller: API key is missing in env variables');
      return res.status(500).json({ message: 'Weather API key not configured in .env' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Weather Controller Error:', error.message);
    if (error.response) {
         console.error('Weather Controller API Error Data:', error.response.data);
         return res.status(error.response.status).json({ message: error.response.data.message || 'Upstream API Error' });
    }
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

module.exports = { getWeather };
