const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// POST /api/openai/report
router.post('/report', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: 'Prompt is required.' });
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ result: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: 'OpenAI API error', error: err.message });
  }
});

module.exports = router; 