const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JDoodle API credentials (store securely in environment variables in production)
const clientId = "41d789b055e5b8dbaa2fe6f6606ffa23";
const clientSecret = "8bd35c40371328eed108fce2ef777246cd37b136a2cfc1b84652591cb17c75c3";

// Route to execute C++ code
app.post('/run-cpp', async (req, res) => {
  const { code, stdin = "" } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid `code` in request body' });
  }

  try {
    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script: code,
        stdin,
        language: 'cpp17',
        versionIndex: '0'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JDoodle API error: ${errorText}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute code', details: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
