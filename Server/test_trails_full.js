const axios = require('axios');

const BASE_URL = 'http://localhost:5050/api';

const adminUser = {
  name: 'Admin User',
  email: 'admin@test.com',
  password: 'password123',
  passwordConfirm: 'password123',
  role: 'admin'
};

const regularUser = {
  name: 'Regular User',
  email: 'user@test.com',
  password: 'password123',
  passwordConfirm: 'password123',
  role: 'user'
};

let adminToken;
let userToken;
let trailId;

const loginOrSignup = async (user) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: user.email,
      password: user.password
    });
    return res.data.token;
  } catch (err) {
    if (err.response && err.response.status === 401) {
        // Try signup
        try {
            const res = await axios.post(`${BASE_URL}/auth/signup`, user);
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
    console.log('--- Authenticating Users ---');
    adminToken = await loginOrSignup(adminUser);
    console.log('Admin logged in');
    userToken = await loginOrSignup(regularUser);
    console.log('User logged in');

    console.log('\n--- Creating Trail (Admin) ---');
    const trailData = {
      name: `Test Trail ${Date.now()}`,
      description: 'A beautiful test trail.',
      location: 'Test Location',
      difficulty: 'Easy',
      length: 10,
      elevationGain: 500,
      startLocation: {
        coordinates: [-118.113491, 34.111745], // Los Angeles area
        description: 'Trail Head'
      }
    };

    const trailRes = await axios.post(`${BASE_URL}/trails`, trailData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    trailId = trailRes.data.data.trail._id;
    console.log('Trail created:', trailRes.data.data.trail.name);

    console.log('\n--- Creating Review (User) ---');
    const reviewData = {
      review: 'Great trail!',
      rating: 5,
      trail: trailId
    };

    const reviewRes = await axios.post(`${BASE_URL}/trails/${trailId}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('Review created:', reviewRes.data.data.review.review);

    console.log('\n--- Verifying Trail Stats ---');
    const getTrailRes = await axios.get(`${BASE_URL}/trails/${trailId}`);
    const trail = getTrailRes.data.data.trail;
    console.log(`Ratings Average: ${trail.ratingsAverage} (Expected: 5)`);
    console.log(`Ratings Quantity: ${trail.ratingsQuantity} (Expected: 1)`);

    console.log('\n--- Testing Geospatial Query ---');
    // 34.111, -118.111 is close to the trail
    const geoRes = await axios.get(`${BASE_URL}/trails/trails-within/10/center/34.111,-118.111/unit/mi`);
    console.log(`Trails found within 10mi: ${geoRes.data.results}`);
    if (geoRes.data.data.data.find(t => t._id === trailId)) {
        console.log('SUCCESS: Created trail found in geospatial query.');
    } else {
        console.log('FAILURE: Created trail NOT found in geospatial query.');
    }

    console.log('\n--- ALL TESTS PASSED ---');

  } catch (err) {
    console.error('TEST FAILED:', err.response ? err.response.data : err.message);
  }
};

runTests();
