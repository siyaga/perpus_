require("dotenv").config();
const Sequelize = require("sequelize"); // Import Sequelize

const config = {
  development: {
    username: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "lifeforme",
    database: process.env.PGDATABASE || "initial",
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    dialect: "postgres",
    logging: false, // Disable logging in production if desired
  },
  production: {
    // ... similar structure as development
  },
};

const env = process.env.NODE_ENV || "development";

// Create Sequelize instance based on the environment configuration
const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  {
    host: config[env].host,
    dialect: config[env].dialect,
    logging: config[env].logging,
  }
);

module.exports = {
  sequelize, // Export the Sequelize instance
  ...config[env], // Export other configurations
};
