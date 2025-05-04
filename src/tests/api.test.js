const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Base URL for API
const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;

// Test user credentials
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  studentID: 'TEST123',
  password: 'password123'
};

// Test admin credentials
const testAdmin = {
  name: 'Test Admin',
  email: 'admin@example.com',
  studentID: 'ADMIN123',
  password: 'password123',
  role: 'admin'
};

// Test event data
const testEvent = {
  title: 'Test Event',
  description: 'This is a test event',
  location: 'Test Location',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  time: '10:00 AM'
};

// Store tokens and IDs
let userToken;
let adminToken;
let eventId;
let registrationId;

// Helper function to log test results
const logResult = (testName, success, error = null) => {
  if (success) {
    console.log(`✅ ${testName}: PASSED`);
  } else {
    console.log(`❌ ${testName}: FAILED`);
    if (error) {
      console.error(`   Error: ${error.message || error}`);
    }
  }
};

// Run tests
const runTests = async () => {
  try {
    console.log('🧪 Starting API tests...\n');

    // Test 1: Register admin user
    try {
      const response = await axios.post(`${API_URL}/auth/register`, testAdmin);
      adminToken = response.data.token;
      logResult('Register Admin User', true);
    } catch (error) {
      logResult('Register Admin User', false, error);
    }

    // Test 2: Register regular user
    try {
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      userToken = response.data.token;
      logResult('Register Regular User', true);
    } catch (error) {
      logResult('Register Regular User', false, error);
    }

    // Test 3: Login as admin
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: testAdmin.email,
        password: testAdmin.password
      });
      adminToken = response.data.token;
      logResult('Login as Admin', true);
    } catch (error) {
      logResult('Login as Admin', false, error);
    }

    // Test 4: Create event (admin only)
    try {
      const response = await axios.post(
        `${API_URL}/events`,
        testEvent,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );
      eventId = response.data.data._id;
      logResult('Create Event', true);
    } catch (error) {
      logResult('Create Event', false, error);
    }

    // Test 5: Get all events
    try {
      const response = await axios.get(`${API_URL}/events`);
      logResult('Get All Events', response.data.success);
    } catch (error) {
      logResult('Get All Events', false, error);
    }

    // Test 6: Get single event
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}`);
      logResult('Get Single Event', response.data.success);
    } catch (error) {
      logResult('Get Single Event', false, error);
    }

    // Test 7: Register for event
    try {
      const response = await axios.post(
        `${API_URL}/events/${eventId}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      registrationId = response.data.data._id;
      logResult('Register for Event', response.data.success);
    } catch (error) {
      logResult('Register for Event', false, error);
    }

    // Test 8: Get user registrations
    try {
      const response = await axios.get(
        `${API_URL}/registrations`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      logResult('Get User Registrations', response.data.success);
    } catch (error) {
      logResult('Get User Registrations', false, error);
    }

    // Test 9: Get event attendees (admin only)
    try {
      const response = await axios.get(
        `${API_URL}/events/${eventId}/attendees`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );
      logResult('Get Event Attendees', response.data.success);
    } catch (error) {
      logResult('Get Event Attendees', false, error);
    }

    // Test 10: Get dashboard stats (admin only)
    try {
      const response = await axios.get(
        `${API_URL}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );
      logResult('Get Dashboard Stats', response.data.success);
    } catch (error) {
      logResult('Get Dashboard Stats', false, error);
    }

    console.log('\n🏁 API tests completed!');
  } catch (error) {
    console.error('Error running tests:', error.message);
  }
};

// Export the test runner
module.exports = runTests;

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
