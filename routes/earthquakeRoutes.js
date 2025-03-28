const express = require('express');
const axios = require('axios');
const cache = require('../middlewares/cache');

const router = express.Router();
const EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

/**
 * GET /earthquakes
 * Fetches earthquake data from USGS API with optional filters.
 */
router.get('/', async (req, res) => {
  try {
    const { startTime, endTime, minmagnitude, maxmagnitude } = req.query;
    const cacheKey = `${startTime}-${endTime}-${minmagnitude}-${maxmagnitude}`;

    if (cache.has(cacheKey)) {
      console.log("Serving from cache...");
      return res.json(cache.get(cacheKey));
    }

    const response = await axios.get(EARTHQUAKE_API_URL, {
      params: {
        format: 'geojson',
        starttime: startTime,
        endtime: endTime,
        minmagnitude: minmagnitude,
        maxmagnitude: maxmagnitude
      }
    });

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earthquake data' });
  }
});

/**
 * GET /earthquakes/:id
 * Fetches earthquake details by its unique ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (cache.has(id)) {
      console.log("Serving earthquake details from cache...");
      return res.json(cache.get(id));
    }

    const response = await axios.get(EARTHQUAKE_API_URL, {
      params: { format: 'geojson', eventid: id }
    });

    cache.set(id, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earthquake details' });
  }
});

module.exports = router;
