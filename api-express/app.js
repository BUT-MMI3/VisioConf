/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const initializeUsers = require('./scripts/initializeDb');

const indexRouter = require("./routes/index");

const app = express();

// generate random string
const randomString = (len) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = len; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

// Set up mongoose connection to MongoDB
const mongoose = require("mongoose");
const withAuth = process.env.MONGO_WITH_AUTH === 'true';
const user = process.env.MONGO_USER || "root";
const password = process.env.MONGO_PASSWORD || "root";
const dbName = process.env.MONGO_DB_NAME || "visioconf";
const url = process.env.MONGO_URL || "localhost";
const port = process.env.MONGO_PORT || 27017;

if (withAuth) {
    mongoose
        .connect(`mongodb://${user}:${password}@${url}:${port}/${dbName}`, {
            authSource: "admin", // Specify the authentication database
        })
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log(err));
}else{
    console.log(`mongodb://${url}:${port}/${dbName}`)
    mongoose
        .connect(`mongodb://${url}:${port}/${dbName}`)
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log(err));
}


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected to the database.");
    initializeUsers();
});

// use sessions for tracking logins
const session = require("express-session");

// configure sessions
app.use(
  session({
    secret: randomString(32),
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// redirect to /auth/login if not logged in
app.use(function (req, res, next) {
  if (!req.session.userId) {
    if (req.url.startsWith("/auth")) {
      return next();
    }
    return res.redirect("/auth/login");
  }

  next();
});

// routes
app.use("/", indexRouter);

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

module.exports = app;
