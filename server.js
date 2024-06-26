const express = require('express');
const cors= require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
// Define allowed origins
const allowedOrigins = ['http://localhost', 'http://localhost:5174', 'http://localhost:5173', 'https://react-water-iot.vercel.app', 'https://www.hydrowtech.com', 'https://hydrowverse.com', 'https://spcrc.iiit.ac.in/', 'https://spcrc.iiit.ac.in'];

// Configure CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback("no entry", false);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

app.use(cors());

// List of endpoints to proxy
const endpoints = [
    'tankdata',
    'waterC',
    'latestwaterC',
    'staticnodesC',
    'borewellnodesC',
    'borewellgraphC',
    'waterminutesdatas',
    'borewelldata',
    'tankerdata'
];

// Configure the proxy for each endpoint
endpoints.forEach(endpoint => {
    app.use(`/water/${endpoint}`, createProxyMiddleware({
        target: `https://spcrc.iiit.ac.in/water/${endpoint}`,
        changeOrigin: true,
    }));    
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});