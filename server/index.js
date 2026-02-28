const express = require('express');
const path = require('path');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Root path redirect to /index.html
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Use analyze router for /api routes
app.use('/api', analyzeRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;