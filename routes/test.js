const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

router.get('/test-openai', async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Simple completion test
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: "Say this is a test"}
      ],
      max_tokens: 100
    });

    res.json({
      status: 'success',
      apiResponse: {
        model: response.model,
        message: response.choices[0]?.message?.content,
        usage: response.usage
      }
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      solution: 'Check your OPENAI_API_KEY in .env'
    });
  }
});

module.exports = router;