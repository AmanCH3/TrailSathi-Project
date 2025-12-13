const axios = require('axios');

const BASE_URL = 'http://localhost:5050/api';

const checkApi = async () => {
    try {
        console.log('Fetching trails from API...');
        const res = await axios.get(`${BASE_URL}/trails`);
        console.log(`Status: ${res.status}`);
        console.log(`Results: ${res.data.results}`);
        if (res.data.results > 0) {
            console.log('Sample Trail:', res.data.data.trails[0].name);
        } else {
            console.log('No trails found via API.');
        }
    } catch (err) {
        console.error('API Error:', err.message);
        if (err.response) {
            console.error('Response Data:', err.response.data);
        }
    }
};

checkApi();
