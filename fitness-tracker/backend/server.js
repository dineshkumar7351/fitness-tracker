const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// App setup
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fitnessDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const fitnessSchema = new mongoose.Schema({
  activity: String,
  duration: Number, // in minutes
  date: { type: Date, default: Date.now }
});
const Fitness = mongoose.model('Fitness', fitnessSchema);

// API Routes
app.get('/api/fitness', async (req, res) => {
  try {
    const logs = await Fitness.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/fitness', async (req, res) => {
  const { activity, duration } = req.body;
  if (!activity || !duration) {
    return res.status(400).json({ error: 'Activity and duration are required' });
  }

  try {
    const newLog = new Fitness({ activity, duration });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add log' });
  }
});

app.delete('/api/fitness/:id', async (req, res) => {
  try {
    const deleted = await Fitness.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
