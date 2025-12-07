const axios = require('axios');

const BASE_URL = 'http://localhost:5050/api';

const regularUser = {
  name: 'Solo Hiker',
  email: 'solo@test.com',
  password: 'password123',
  passwordConfirm: 'password123',
  role: 'user'
};

const adminUser = {
  name: 'Admin User',
  email: 'admin@test.com',
  password: 'password123',
  passwordConfirm: 'password123',
  role: 'admin'
};

let userToken;
let adminToken;
let trailId;
let soloHikeId;

const loginOrSignup = async (user) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: user.email,
      password: user.password
    });
    return res.data.token;
  } catch (err) {
    if (err.response && err.response.status === 401) {
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, user);
            return res.data.token;
        } catch (signupErr) {
             console.error('Signup failed:', signupErr.response ? signupErr.response.data : signupErr.message);
             throw signupErr;
        }
    }
    console.error('Login failed:', err.response ? err.response.data : err.message);
    throw err;
  }
};

const runTests = async () => {
  try {
    console.log('--- Authenticating ---');
    userToken = await loginOrSignup(regularUser);
    adminToken = await loginOrSignup(adminUser);
    console.log('User and Admin logged in');

    console.log('\n--- Creating Trail (Admin) ---');
    const trailData = {
      name: `Solo Trail ${Date.now()}`,
      description: 'Perfect for solo hiking.',
      location: 'Quiet Hills',
      difficulty: 'Moderate',
      length: 5,
      elevationGain: 300,
      startLocation: {
        coordinates: [-118.2, 34.2],
        description: 'Trail Head'
      }
    };
    const trailRes = await axios.post(`${BASE_URL}/trails`, trailData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    trailId = trailRes.data.data.trail._id;
    console.log('Trail created:', trailRes.data.data.trail.name);

    console.log('\n--- Scheduling Solo Hike (User) ---');
    const soloHikeData = {
        trail: trailId,
        startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        notes: 'Excited for this one!'
    };
    const scheduleRes = await axios.post(`${BASE_URL}/solo-hikes`, soloHikeData, {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    soloHikeId = scheduleRes.data.data.soloHike._id;
    console.log('Solo hike scheduled:', scheduleRes.data.message);

    console.log('\n--- Getting My Solo Hikes (User) ---');
    const myHikesRes = await axios.get(`${BASE_URL}/solo-hikes/mine?status=planned`, {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    const myHikes = myHikesRes.data.data.data;
    if (myHikes.find(h => h._id === soloHikeId)) {
        console.log('SUCCESS: Scheduled hike found in my list.');
    } else {
        console.log('FAILURE: Scheduled hike NOT found in my list.');
    }

    console.log('\n--- Updating Hike Status (User) ---');
    const updateData = {
        status: 'completed',
        rating: 5,
        difficultyFelt: 'Easy',
        notes: 'It was easier than expected.'
    };
    const updateRes = await axios.patch(`${BASE_URL}/solo-hikes/${soloHikeId}/status`, updateData, {
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('Hike updated:', updateRes.data.message);
    console.log('New Status:', updateRes.data.data.soloHike.status);

    console.log('\n--- ALL TESTS PASSED ---');

  } catch (err) {
    console.error('TEST FAILED:', err.response ? err.response.data : err.message);
  }
};

runTests();
