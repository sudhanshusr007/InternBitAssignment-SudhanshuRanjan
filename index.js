require('dotenv').config();
const express = require('express');
const earthquakeRoutes = require('./routes/earthquakeRoutes');
const limiter = require('./middlewares/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(limiter);

// Routes
app.get('/', (req, res) => res.send("Earthquake API Wrapper is running!"));
app.use('/earthquakes', earthquakeRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
