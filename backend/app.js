const fs = require('fs');
const path = require('path');
const config = require('./config'); // Load the configuration file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Goal = require('./models/goal');
const cors = require('cors');
const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);
let server_address = `${process.env.SERVER_ADDRESS}`;
console.log("server_address is " + server_address);
// Allow requests from multiple origins
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://139.162.44.216:3000'
// ];
const allowedOrigins = config.allowedOrigins;
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
// app.use(cors({
//     // origin: 'http://localhost', // Allow requests from this origin
//     // origin: 'http://localhost/*', // Allow requests from this origin
//     // origin: 'http://localhost/goals', // Allow requests from this origin
//     // origin: 'http://localhost:3000', // Allow requests from this origin
//     origin: server_address, // Allow requests from this origin
//     // origin: 'http://192.168.160.157', // Allow requests from this origin
//     // origin: 'http://192.168.160.157/*', // Allow requests from this origin
//     // origin: 'http://192.168.160.157:3000', // Allow requests from this origin
//     // origin: 'http://139.162.44.216:3000', // Allow requests from this origin
//     // origin: 'http://139.162.44.216/*' // Allow requests from this origin
// }));
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/goals', async (req, res) => {
  console.log('TRYING TO FETCH GOALS');
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
      })),
    });
    console.log('FETCHED GOALS');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load goals.' });
  }
});

app.post('/goals', async (req, res) => {
  console.log('TRYING TO STORE GOAL');
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    console.log('INVALID INPUT - NO TEXT');
    return res.status(422).json({ message: 'Invalid goal text.' });
  }

  const goal = new Goal({
    text: goalText,
  });

  try {
    await goal.save();
    res
      .status(201)
      .json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
    console.log('STORED NEW GOAL');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save goal.' });
  }
});

app.delete('/goals/:id', async (req, res) => {
  console.log('TRYING TO DELETE GOAL');
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted goal!' });
    console.log('DELETED GOAL');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete goal.' });
  }
});

mongoose.connect(
  // 'mongodb://localhost:27017/course-goals',
  // 'mongodb://host.docker.internal:27017/course-goals',
  // 'mongodb://han:secret@mongodb:27017/course-goals?authSource=admin',
  `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/course-goals?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB!');
      app.listen(80);
    }
  }
);
