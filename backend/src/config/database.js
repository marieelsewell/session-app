// configure and establish the connection between my Node.js application and the MySQL database 

require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize'); // Import Sequelize class from sequelize package

// create a new instance of the Sequelize class and connect to the MySQL database
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

// test the connection to the database
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed');
        console.error(error);
    }
};

// export the sequelize instance and the connectDB function
module.exports = { sequelize, connectDB };