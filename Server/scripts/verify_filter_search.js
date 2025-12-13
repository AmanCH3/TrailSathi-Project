const axios = require('axios');

const BASE_URL = 'http://localhost:5050/api';

const adminUser = {
  email: 'admin@test.com',
  password: 'password123'
};

let adminToken;
let trailIds = [];

const login = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, adminUser);
    return res.data.token;
  } catch (err) {
    if (err.response?.status === 401) {
        // Try register if login fails (first run)
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Admin User',
                email: adminUser.email,
                password: adminUser.password,
                passwordConfirm: adminUser.password,
                phone: '1234567890',
                role: 'admin'
            });
            return res.data.token;
        } catch (regErr) {
            console.error('Registration failed:', regErr.response?.data || regErr.message);
            throw regErr;
        }
    }
    console.error('Login failed:', err.response?.data || err.message);
    throw err;
  }
};

const createTrail = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/trails`, data, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        trailIds.push(res.data.data.trail._id);
        console.log(`Created trail: ${data.name}`);
        return res.data.data.trail;
    } catch (err) {
        console.error(`Failed to create trail ${data.name}:`, err.response?.data || err.message);
    }
};

const runVerification = async () => {
    try {
        console.log('--- specific verification for Filter & Search ---');
        adminToken = await login();
        console.log('Logged in as Admin');

        // Create Test Data
        // Trail A: Short, Easy, Low Elevation, Short Duration
        // Trail B: Long, Hard, High Elevation, Long Duration
        // Trail C: Medium, Moderate, Med Elevation, Med Duration
        
        const timestamp = Date.now();
        await createTrail({
            name: `Easy Peasy Walk ${timestamp}`,
            location: 'Park A',
            difficulty: 'Easy',
            length: 5,
            elevationGain: 100,
            duration: 2,
            startLocation: { coordinates: [0, 0], description: 'A' },
            description: 'Short walk'
        });

        await createTrail({
            name: `Hard Core Climb ${timestamp}`,
            location: 'Mountain B',
            difficulty: 'Hard',
            length: 20,
            elevationGain: 1000,
            duration: 8,
            startLocation: { coordinates: [0, 0], description: 'B' },
            description: 'Hard climb'
        });
        
        await createTrail({
            name: `Moderate Hike ${timestamp}`,
            location: 'Hill C',
            difficulty: 'Moderate',
            length: 12,
            elevationGain: 500,
            duration: 5,
            startLocation: { coordinates: [0, 0], description: 'C' },
            description: 'Moderate hike'
        });

        console.log('\n--- Testing Search ---');
        // Search "Peasy"
        let res = await axios.get(`${BASE_URL}/trails?search=Peasy`);
        console.log(`Search "Peasy": Found ${res.data.results} trails.`);
        console.log('DEBUG:', JSON.stringify(res.data.debug, null, 2));
        if (res.data.results >= 1 && res.data.data.trails.some(t => t.name.includes('Easy Peasy Walk'))) {
            console.log('PASS: Search by name');
        } else {
            console.log('FAIL: Search by name');
        }

        console.log('\n--- Testing Filter: Max Distance (10km) ---');
        res = await axios.get(`${BASE_URL}/trails?maxDistance=10`);
        // Should find only Easy Peasy (5km) (and maybe others if existing DB has them, but assuming mainly testing our created ones or checking logic)
        // We check if "Easy Peasy Walk" is present and "Moderate Hike" (12km) is ABSENT.
        const namesDistance = res.data.data.trails.map(t => t.name);
        console.log(`Found: ${namesDistance.join(', ')}`);
        if (namesDistance.includes('Easy Peasy Walk') && !namesDistance.includes('Moderate Hike')) {
            console.log('PASS: Max Distance Filter');
        } else {
            console.log('FAIL: Max Distance Filter');
        }

        console.log('\n--- Testing Filter: Max Elevation (600m) ---');
        res = await axios.get(`${BASE_URL}/trails?maxElevation=600`);
        const namesElev = res.data.data.trails.map(t => t.name);
        if (namesElev.includes('Easy Peasy Walk') && namesElev.includes('Moderate Hike') && !namesElev.includes('Hard Core Climb')) {
             console.log('PASS: Max Elevation Filter');
        } else {
             console.log('FAIL: Max Elevation Filter');
        }

        console.log('\n--- Testing Filter: Max Duration (6h) ---');
        res = await axios.get(`${BASE_URL}/trails?maxDuration=6`);
        const namesDur = res.data.data.trails.map(t => t.name);
        if (namesDur.includes('Easy Peasy Walk') && namesDur.includes('Moderate Hike') && !namesDur.includes('Hard Core Climb')) {
             console.log('PASS: Max Duration Filter');
        } else {
             console.log('FAIL: Max Duration Filter');
        }

        console.log('\n--- Testing Filter: Difficulty (Hard) ---');
        res = await axios.get(`${BASE_URL}/trails?difficulty=Hard`);
        const namesDiff = res.data.data.trails.map(t => t.name);
        if (namesDiff.includes('Hard Core Climb') && !namesDiff.includes('Easy Peasy Walk')) {
             console.log('PASS: Difficulty Filter');
        } else {
             console.log('FAIL: Difficulty Filter');
        }
        
    } catch (err) {
        console.error('VERIFICATION ERROR:', err.response?.data || err.message);
    }
};

runVerification();
