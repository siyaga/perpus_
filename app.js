const express = require("express");
const { Pool } = require("pg");
const config = require("./config");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 3000;
// Database synchronization
config.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing the database: ", error.message);
    // Ideally, you might want to exit the process here if the database sync fails
    process.exit(1);
  });

app.use(express.json());
app.use("/users", userRoutes); // Use user routes

// 404 Error Handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error); // Pass the error to the next middleware (error handler)
});

// Error Handler Middleware (must have 4 arguments)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      //...(process.env.NODE_ENV === "production" ? null : { stack: err.stack }),
    },
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

module.exports = app; // Ex
