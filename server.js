const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
require("dotenv").config();
const cors = require("cors");

const user = require("./routes/user");
const profile = require("./routes/profile");
const property = require("./routes/property");

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./public", "images")));

//DB Setup
const db = require("./config/keys").mongoURI;
mongoose
  .connect(process.env.MONGODB_URI || db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());

//Config Passport stratergy
require("./config/passport")(passport);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../../frontend-master/build"));
}
//API Route
app.use("/api/user/", user);
app.use("/api/profile/", profile);
app.use("/api/property/", property);

// Hanlding unhandled promises
process.on("unhandledRejection", (ex) => {
  throw ex;
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Server Setup
app.listen(process.env.PORT || 3001, function () {
  console.log("Server running on localhost:");
});
