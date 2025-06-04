const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Replace with your actual JDoodle credentials
const clientId = "41d789b055e5b8dbaa2fe6f6606ffa23";
const clientSecret = "8bd35c40371328eed108fce2ef777246cd37b136a2cfc1b84652591cb17c75c3";

app.post('/run-cpp', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script: code,
        language: 'cpp17',
        versionIndex: '0'
      })
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute code', details: error.message });
  }
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));

