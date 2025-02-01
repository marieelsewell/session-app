const express = require('express');
require('dotenv').config();
const { sequelize, connectDB } = require('./config/database');
const db = require('./models'); // Import the models

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse incoming JSON requests
app.use(express.json());

//connect to database
(async () => {
  try {
    await connectDB();

    // Sync the models with the database
    await sequelize.sync({ force: false });
    console.log('Database & tables created!');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Unable to sync the database at ${new Date().toISOString()}:`, error);
  }
})();