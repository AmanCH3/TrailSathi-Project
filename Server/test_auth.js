const axios = require('axios');

const API_URL = 'http://localhost:5050/api/auth';

const testAuth = async () => {
    try {
        // 1. Register
        console.log('Testing Registration...');
        const registerRes = await axios.post(`${API_URL}/register`, {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            phone: '1234567890',
            role: 'user'
        });
        console.log('Registration Success:', registerRes.data.success);
        const token = registerRes.data.token;

        // 2. Login
        console.log('Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: registerRes.data.user.email,
            password: 'password123'
        });
        console.log('Login Success:', loginRes.data.success);

        // 3. Logout
        console.log('Testing Logout...');
        const logoutRes = await axios.get(`${API_URL}/logout`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Logout Success:', logoutRes.data.success);

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        } else if (error.request) {
            console.error('No Response Received');
        } else {
            console.error('Error Config:', error.config);
        }
    }
};

testAuth();
