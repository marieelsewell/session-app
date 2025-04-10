const express = require('express');
require('dotenv').config();
const path = require('path');
const { sequelize, connectDB } = require('./config/database');
const cors = require("cors");

const db = require('./models'); // Import the models

const bodyParser = require('body-parser'); 
const userRoutes = require("./routes/users");
const sessionRoutes = require("./routes/sessions");
const lyricRoutes = require("./routes/lyrics");
const recordingRoutes = require("./routes/recordings")
const progressionRoutes = require("./routes/progression");

const app = express();
app.use(cors({ origin: "http://localhost:8081" }));
const PORT = process.env.PORT || 8080;

// Serve uploaded audio files
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));


//parse incoming JSON requests
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/lyrics", lyricRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/progression", progressionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to database
(async () => {
  try {
    await connectDB();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

const http = require('http');
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;