require("dotenv").config();
require("express-async-errors");
require("./lib/env-vars-checker");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

//* **`` Routers ``**
const authRouter = require("./routes/auth");
const exercisesRouter = require("./routes/exercises");

//* **`` Error Handlers ``**
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//* **`` Extra Security Packages ``**
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//* **`` Swagger ``**
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

//* **`` Middleware ``**
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//* **`` Routes ``**
// app.get("/", (req, res) => {
//   res.send('<h1>Exercise API</h1><a href="/api-docs">Documentation</a>');
// });
app.use(express.static("public"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exercises", authenticateUser, exercisesRouter);

//* **`` Error Handlers ``**
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//* **`` Connection ``**
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
