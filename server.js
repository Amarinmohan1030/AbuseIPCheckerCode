const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4000;
const API_KEY = 'a9ebf16dbf41f0666dc2239b8150d64d11ffe08bb260137d05c03e4eaf59ace0b2229940c33f38ec'; // Replace with your real AbuseIPDB API key

app.use(cors());

app.get('/check-ip', async (req, res) => {
  const ip = req.query.ip;
  if (!ip) return res.status(400).json({ error: 'IP address required' });

  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: {
        ipAddress: ip,
        maxAgeInDays: 90
      },
      headers: {
        Accept: 'application/json',
        Key: API_KEY
      }
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
