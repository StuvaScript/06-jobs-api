require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const exercisesRouter = require("./routes/exercises");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//* **`` Middleware ``**
app.use(express.json());

//* **`` Routes ``**
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exercises", exercisesRouter);

//* **`` Error Handlers ``**
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//* **`` Connection ``**
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
