const requireDir = require("require-dir");
requireDir("./models", { recurse: true });
// require("./models/User");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger-output.json");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const keysRoute = require("./routes/keysRoute");
const indexRouter = require("../src/routes/index");
const populate = require("./components/pupulate");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
// populate();
app.use(cors(corsOptions));
app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/codes", keysRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/db-status', (req, res) => {
  const state = mongoose.connection.readyState;
  if (state === 0) {
    res.status(500).send('Database is disconnected');
  } else if (state === 1) {
    res.send('Database is connected');
  } else if (state === 2) {
    res.status(500).send('Database is connecting');
  } else if (state === 3) {
    res.status(500).send('Database is disconnecting');
  }
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const mongoUri = process.env.DB_URL;
if (!mongoUri) {
  throw new Error(
    `MongoURI was not supplied.  Make sure you watch the video on setting up Mongo DB!`
  );
}
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 60000,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});

module.exports = app;
