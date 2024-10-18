const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const apiData = require('../ApiData'); // Import the apiData
const { v4: uuidv4 } = require('uuid'); //for generating random ids
const cors = require('cors')
const bodyParser = require("body-parser")
require('dotenv').config();


const app = express();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Enable CORS for all origins (for testing/development)
app.use(cors());

// OR Enable CORS for specific origins (recommended for production)
const corsOptions = {
    origin: process.env.CLIENT_URL, // Add your frontend domain here
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    credentials: true // Set to true if you need to pass credentials like cookies in cross-origin requests
};

// Set up Redis client
const redis = new Redis({
    password: process.env.REDIS_PASSWORD,
    socket: {
       host: process.env.REDIS_HOST, // Redis server address
       port:process.env.REDIS_PORT        // Redis server port
    }
});
redis.connect(console.log("Connected Redis")).catch(console.error);

// Connect to MongoDB (your connection string)
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));;

// Middleware to check authentication (Bearer token)

const authenticateBearerToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token)
    if (!token) {
        
        return res.status(401).json({ message: 'Authorization token required' });
    }

    // Validate the Bearer token (you can add actual validation logic here if needed)
    const expectedToken = process.env.BRTOKEN; // You should replace this with the correct token
    if (token === `Bearer ${expectedToken}`) {
        next();
    } else {
        return res.status(403).json({ message: 'Invalid token' });
    }
};



app.get('/api/employee/assets', authenticateBearerToken, (req, res) => {

    try {
        // Find the API route in apiData.js
        const apiRoute = apiData.find(api => 
            api.requestUrl.URL === '/api/employee/assets' && api.requestType === 'GET');

        // Log the found API route for debugging
        // console.log(apiRoute);

        

        // Check if the API route exists
        if (!apiRoute) {
            return res.status(404).json({ message: 'API route not found' });
        }
        
        const response = apiRoute.requestUrl.response;

        // console.log("api response ", response)
        // Since we already handled the Bearer token in middleware, we can send the response
        return res.status(apiRoute.responseCode).json(response);
    } catch (error) {
        console.error('Error while handling GET /api/employee/assets:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

});


// Middleware to check authorization
const checkAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log('Authorization Header:', authHeader); // Log the authorization header

        // Check if the authorization header is present and starts with 'Basic '
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract the token (base64 encoded credentials) from the header
        const token = authHeader.split(' ')[1]; // Get the base64 encoded part
        // console.log('Base64 Token:', token); // Log the base64 token

        // Check if token is undefined or empty
        if (!token) {
            return res.status(401).json({ message: 'Missing token' });
        }

        // Decode the credentials from base64
        const decodedCredentials = Buffer.from(token, 'base64').toString('utf8');
        // console.log('Decoded Credentials:', decodedCredentials); // This should now print the credentials

        // Extract username and password from the decoded credentials
        const [username, password] = decodedCredentials.split(':'); // Assuming the format is username:password

        // Define valid credentials for checking (replace these with your own logic)
        const validUsername = process.env.AUTHUSER; // Replace with your actual username
        const validPassword = process.env.AUTHPASSWORD; // Replace with your actual password

        // Validate the decoded username and password against the valid ones
        if (username === validUsername && password === validPassword) {
            console.log('Valid Credentials:', decodedCredentials); // Log the valid credentials
            next(); // Proceed to the next middleware/route handler
        } else {
            return res.status(403).json({ message: "Invalid Credentials" }); // Unauthorized access
        }
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Middleware for API key authentication
const authenticateAPIKey = (req, res, next) => {
    const apiKey = req.headers['authorization']; // Get API key from the 'Authorization' header
   
    // Check if the API key is present and valid (you can define a valid API key)
    const validApiKey = process.env.APIKEY; // Replace with your actual valid API key
    console.log(validApiKey)
    if(apiKey === `Basic ${validApiKey}`){
        next()
    }else{
        return res.status(401).json({ message: "Unauthorized. Invalid API key." });
    }
    // if (!apiKey || apiKey !== validApiKey) {
    //     return res.status(401).json({ message: "Unauthorized. Invalid API key." });
    // }
    // next(); // If valid, proceed to the next middleware or route handler
};

// DELETE endpoint - remove an asset from an employee
app.delete('/api/employee/123/assets/remove/234', authenticateAPIKey, async (req, res) => {
    try {
        // Log the incoming request for debugging
        // console.log("Request Headers:", req.headers);
        // console.log("Request Body:", req.body);
        // console.log(`Received DELETE request for: /api/employee/123/assets/remove/234`);

        // Here you would typically perform the logic to remove the asset for the employee
        // For example, you might want to query your database to delete the asset

        // Example logic for deletion (assuming you have a database model)
        // const result = await AssetModel.deleteOne({ employeeId: '123', assetId: '234' });

        // Simulate deletion success
        const deletionSuccess = true; // Replace with your actual deletion logic

        // If the deletion was successful
        if (deletionSuccess) {
            return res.status(200).json({ message: "Asset successfully removed." });
        } else {
            return res.status(404).json({ message: "Asset not found." });
        }

    } catch (error) {
        console.error("Error occurred while removing asset:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});


// Get all employees or filter by role and location
app.get('/api/employees', (req, res) => {
    const matchedApi = apiData.find(item => item.requestUrl.URL === '/api/employees');

    // Check if matchedApi exists and has the expected structure
    if (!matchedApi || !matchedApi.requestUrl || !Array.isArray(matchedApi.requestUrl.response)) {
        return res.status(404).json({ message: "Endpoint not found or no employee data available." });
    }

    // Extract employees from the response
    const employeesData = matchedApi.requestUrl.response[0]; // Access the first element of the array

    // Ensure employeesData contains an employees array
    if (!employeesData || !Array.isArray(employeesData.employees)) {
        return res.status(404).json({ message: "No employee data available." });
    }

    // Get the array of employees
    const employees = employeesData.employees;

    // Get role and location from the query parameters
    let { role, location } = req.query;

    // Trim spaces and ensure case insensitivity
    if (role) {
        role = role.trim().toLowerCase();
    }
    if (location) {
        location = location.trim().toLowerCase();
    }

    // Filter employees based on role and location
    let filteredEmployees = employees;

    // Filter by role if provided
    if (role) {
        filteredEmployees = filteredEmployees.filter(employee =>
            employee.role && employee.role.toLowerCase() === role
        );
    }

    // Filter by location if provided
    if (location) {
        filteredEmployees = filteredEmployees.filter(employee =>
            employee.location && employee.location.toLowerCase() === location
        );
    }

    // If no employees found after filtering, return a not found message
    if (filteredEmployees.length === 0) {
        return res.status(404).json({ message: "No employees found matching the criteria." });
    }

    // Return the filtered employees data
    return res.status(200).json({
        total: filteredEmployees.length,
        employees: filteredEmployees
    });
});


// GET endpoint - fetch an employee by ID
app.get('/api/employees/:id', (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
  
    // Validate the ID to ensure it is a number
    const employeeId = parseInt(id, 10);
    if (isNaN(employeeId) || employeeId <= 0) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
  
    // Find the matching request URL in apiData
    const matchedApi = apiData.find(item => item.requestUrl.URL === '/api/employees');
  
    // Ensure matchedApi is found
    if (!matchedApi || !matchedApi.requestUrl || !matchedApi.requestUrl.response) {
        return res.status(404).json({ message: "Endpoint not found" }); // Handle case where endpoint is not found
    }
  
    // Extract the employees array from the response
    const employees = matchedApi.requestUrl.response[0].employees; // Access the first object in the response array
  
    // Find the specific employee by ID
    const employee = employees.find(emp => emp.id === employeeId);
  
    // If the employee exists, return the data; otherwise, return an error
    if (employee) {
        return res.status(200).json(employee); // Return the specific employee data
    } else {
        return res.status(404).json({ message: "Employee not found" }); // Handle case where employee is not found
    }
  });
  



// GET endpoint - fetch all employees
app.get('*', (req, res) => {
  const requestUrl = req.originalUrl; // Get the incoming request URL

  // Find the matching requestUrl in apiData
  const matchedApi = apiData.find(item => item.requestUrl.URL === requestUrl);
  
  if (matchedApi) {
      return res.status(200).json(matchedApi.requestUrl.response); // Return the matched response
  } else {
      return res.status(404).json({ message: "Endpoint not found" }); // Handle 404 for unmatched URLs
  }
});


// POST endpoint - store in Redis
app.post('/api/employees/create', async (req, res) => {
    try {
        const employeeData = req.body;
        
        if (!employeeData || Object.keys(employeeData).length === 0) {
            return res.status(400).json({ message: 'No employee data provided' });
        }

        // console.log(employeeData);

        const employeeId = uuidv4(); // Generate unique ID
        const newEmployee = { id: employeeId, ...employeeData };
        // console.log(newEmployee);

        const redisKey = `employee:${newEmployee.email}`;

        // Store data in Redis with expiration time of 7 days
        await redis.set(redisKey, JSON.stringify(newEmployee), 'EX', 7 * 24 * 60 * 60);

        return res.status(201).json({ newEmployee });
    } catch (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// PUT endpoint - update in Redis
app.put('/api/employees/update/:id', async (req, res) => {
    const employeeData = req.body;
    const employeeId = req.params.id;

    // Store updated employee data in Redis
    const redisKey = `employee:${employeeId}`; 

    // Update data in Redis with an expiration time of 7 days
    await redis.set(redisKey, JSON.stringify(employeeData), 'EX', 7 * 24 * 60 * 60);

    return res.status(200).json({ employeeData });
});

// PATCH endpoint - patch in Redis
app.patch('/api/employees/update/:id', async (req, res) => {
    const employeeData = req.body;
    const employeeId = req.params.id;

    // Store patched employee data in Redis
    const redisKey = `employee:${employeeId}`; 

    // Update data in Redis with an expiration time of 7 days
    await redis.set(redisKey, JSON.stringify(employeeData), 'EX', 7 * 24 * 60 * 60);

    return res.status(200).json({employeeData });
});


// DELETE endpoint for removing an employee by ID
app.delete('/api/employees/:id', (req, res) => {
    // Regardless of the ID provided, return a 204 No Content response
    return res.status(204).send(); // Sends an empty response with 204 status
});





// POST: /api/employee/:employeeId/assets/add

app.post('/api/employee/assets/add', checkAuth, (req, res) => {
// without ID in response    
  try {
    const { headers, body } = req;

    // Check if headers match expected values (optional)
    if (headers['content-type'] !== 'application/json') {
      return res.status(400).json({ error: 'Invalid Content-Type' });
    }

    // Find the matching API endpoint in apiData
    const endpoint = apiData.find(api => 
      api.requestUrl.URL === '/api/employee/assets/add' && api.requestType === 'POST'
    );


     // Generate a random ID for the asset
     const assetId = uuidv4(); // Create a new UUID


    if (endpoint) {
      // Optional: Validate incoming data
      const { assetName, assetType, assignedDate, status } = body;
      if (!assetName || !assetType || !assignedDate || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Prepare the response including the generated ID
      const response = {
        
          id: assetId, // Include the generated ID
          assetName,
          assetType,
          assignedDate,
          status,
        
      };
      // Send the response from the endpoint
    //   return res.status(endpoint.request.responseCode).json(endpoint.request.response);
    return res.status(endpoint.request.responseCode).json({
        id: assetId, // Include the generated ID
        assetName,
        assetType,
        assignedDate,
        status, // Use the body directly
      });
    } else {
      // If no matching endpoint is found, return a 404 response
      return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error in /api/employee/assets/add:', error); // Log the error for debugging
    return res.status(500).json({ error: 'Internal Server Error' }); // Send a 500 response
  }
});




// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
