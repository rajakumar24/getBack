const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
require("dotenv").config();
//
const multipart = require("connect-multiparty");
const cloudinary = require("cloudinary");
const Datastore = require("nedb");
const Pusher = require("pusher");
// 1
const cors = require("cors");
// const morgan = require("morgan");

const user = require("./routes/user");
const profile = require("./routes/profile");
const property = require("./routes/property");

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./public", "images")));
// const api = require('./src/router/api');
// const basicdetails = require('./src/router/Basicdetail');
// const contactagent= require('./src/router/contactagent');

//DB Setup
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, {
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

// const db = "mongodb://localhost:27017/getRightProperty";
// mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true}, function(err){
//     if(err){
//         console.error('Error! ' + err)
//     } else {
//       console.log('Connected to mongodb')
//     }
// });

//2
// app.use(cors({ origin: "*" }));
// app.use('/uploads',express.static('uploads'));
app.use(cors());

//3
// app.use(morgan("dev"));
// app.use(bodyParser.json({limit: '10mb', extended: true}))
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());

//Config Passport stratergy
require("./config/passport")(passport);

//API Route
app.use("/api/user/", user);
app.use("/api/profile/", profile);
app.use("/api/property/", property);

// Hanlding unhandled promises
process.on("unhandledRejection", (ex) => {
  throw ex;
});

//Set static folder
// app.use(express.static("client/build"));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

// app.use('/api', api);
// app.use('/api', basicdetails);
// app.use('/api', contactagent);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

// app.get('*',(req, res) => {
//   res.sendFile(path.join(__dirname,'client','build','index.html'));
// });

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
const port = 3001;
app.listen(process.env.PORT || port, function () {
  console.log("Server running on localhost:" + port);
});
