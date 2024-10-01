const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const AWS = require('aws-sdk');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const User = require('./models/user'); // Import the user schema

// Fetch user data by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Fetch weather data based on user's location
app.get('/api/weather/:location', async (req, res) => {
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.location}&appid=${process.env.WEATHER_API_KEY}`);
      res.json(weatherResponse.data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching weather data' });
    }
  });
  
  // Mock stock availability for a product
  app.get('/api/stock/:productId', (req, res) => {
    const stock = Math.floor(Math.random() * 100); // Random stock number
    res.json({ productId: req.params.productId, stock });
  });
// Set up AWS Polly for Text-to-Speech
const polly = new AWS.Polly();

app.get('/api/tts/:text', (req, res) => {
  const params = {
    Text: req.params.text,
    OutputFormat: 'mp3',
    VoiceId: 'Joanna'
  };

  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error generating speech' });
    } else {
      res.set('Content-Type', 'audio/mp3');
      res.send(data.AudioStream);
    }
  });
});
  