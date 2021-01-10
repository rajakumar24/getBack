const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

//load profile model
const Profile = require("../models/Profile");
const User = require("../models/User");
const Property = require("../models/Property");
const Text = require("../models/Text");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

var authy = require("authy")("VS4JQCGv5Xk2tUpULM8fUYAIZerjdiEi");

//load validation function
const validateUpdateProfile = require("../validation/profile");
const { modelName } = require("../models/User");

// //
// const db = new Datastore();
// const multipartMiddleware = multipart();
// // Pusher configuration
// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.PUSHER_APP_CLUSTER,
//   encrypted: true,
// });

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// //

//@Route /api/profile/update
router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateUpdateProfile(req.body);

    //check validation
    if (!isValid) {
      return res.status(400).send(errors);
    }

    //get all fields
    const profileDetails = {
      user: req.user.id,
      name: req.body.name,
      email: req.body.email,
      country: req.body.country,
      address: req.body.address,
      about: req.body.about,
      mobile: req.body.mobile,
      skype: req.body.skype,
      website: req.body.website,
      imgUrl: req.body.imgUrl,
      socialMedia: {
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        linkedin: req.body.linkedin,
      },
    };

    const profile = await Profile.findOne({
      user: mongoose.Types.ObjectId(req.user.id),
    });

    if (!profile) {
      const newProfile = await new Profile(profileDetails).save();
      res.status(200).send(newProfile);
    } else {
      const updateUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email,
      });
      const newProfile = await Profile.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(req.user.id) },
        { $set: profileDetails },
        { new: true }
      ).populate("user", ["-password"]);
      res.status(200).send(newProfile);
      console.log("hi", newProfile);
    }
  }
);

//add
router.get("/otp", function (req, res) {
  console.log("New otp request...");
  var isSuccessful = false;

  var email = req.param("email");
  var phone = req.param("phone");
  var countryCode = req.param("countryCode");

  const countryCodeValue = `+${countryCode}`;
  authy.register_user(
    email,
    phone,
    countryCodeValue,
    function (regErr, regRes) {
      console.log("In Registration...");
      if (regErr) {
        console.log(regErr);
        res.send("There was some error registering the user.");
      } else if (regRes) {
        console.log("hi", regRes);
        const id = regRes.user.id;
        const newPost = new Text({
          // user: req.user.id,
          // email,
          phone,
          countryCode,
          id,
        });
        newPost.save();

        authy.request_sms(regRes.user.id, function (smsErr, smsRes) {
          console.log("Requesting SMS...");
          if (smsErr) {
            console.log(smsErr);
            res.send("There was some error sending OTP to cell phone.");
          } else if (smsRes) {
            console.log(smsRes);
            res.send(newPost);
          }
        });
      }
    }
  );
});
// router.get(
//   "/otp", function (req, res) {
//     // passport.authenticate("jwt", { session: false }),
//     // async (req, res) => {
//     //   const { errors, isValid } = validateUpdateProfile(req.body);

//     //check validation
//     // if (!isValid) {
//     //   return res.status(400).send(errors);
//     // }
//     var idd = req.user.id
//     var email = req.param('email');
//     var phone = req.param('phone');
//     var countryCode = req.param('countryCode');
//     var idvalue;
//     const countryCodeValue = `+${countryCode}`
//     authy.register_user(
//       email,
//       phone, countryCodeValue, function (regErr, regRes) {
//         console.log('In Registration...');
//         if (regErr) {
//           console.log(regErr);
//           res.send('There was some error registering the user.');
//         } else if (regRes) {
//           console.log("hi", regRes);
//           const id = regRes.user.id
//           idvalue = id
//           // const profileDetails = {
//           //   user: idd,
//           //   // email: email,
//           //   phone: phone,
//           //   countryCode: countryCode,
//           //   id: id
//           // };

//           // const profile = Text.findOne({
//           //   user: mongoose.Types.ObjectId(req.user.id)
//           // });

//           // if (!profile) {
//           //   const newProfile = new Text(profileDetails).save();
//           //   res.status(200).send(newProfile);
//           // } else {
//           //   const updateUser = User.findByIdAndUpdate(req.user.id, {

//           //     email: req.body.email
//           //   });
//           //   const newProfile = Text.findOneAndUpdate(
//           //     { user: mongoose.Types.ObjectId(req.user.id) },
//           //     { $set: profileDetails },
//           //     { new: true }
//           //   ).populate("user", ["-password"]);
//           //   res.status(200).send(newProfile);
//           // }
//           authy.request_sms(regRes.user.id, function (smsErr, smsRes) {
//             console.log('Requesting SMS...');
//             if (smsErr) {
//               console.log(smsErr);
//               res.send('There was some error sending OTP to cell phone.');
//             } else if (smsRes) {
//               console.log(smsRes);
//               res.send('OTP Sent to the cell phone.');
//             }
//           });
//         }
//       });
//     const profileDetails = {
//       user: req.user.id,
//       // email: email,
//       phone: phone,
//       countryCode: countryCode,
//       id: idvalue
//       // name: req.body.name,
//       // email: req.body.email,
//       // country: req.body.country,
//       // address: req.body.address,
//       // about: req.body.about,
//       // mobile: req.body.mobile,
//       // skype: req.body.skype,
//       // website: req.body.website,
//       // socialMedia: {
//       //   facebook: req.body.facebook,
//       //   twitter: req.body.twitter,
//       //   linkedin: req.body.linkedin
//       // }
//     };

//     const profile = Text.findOne({
//       user: mongoose.Types.ObjectId(req.user.id)
//     });

//     if (!profile) {
//       const newProfile = new Text(profileDetails).save();
//       res.status(200).send(newProfile);
//     } else {
//       const updateUser = User.findByIdAndUpdate(req.user.id, {
//         // name: req.body.name,
//         email: req.body.email
//       });
//       const newProfile = Text.findOneAndUpdate(
//         { user: mongoose.Types.ObjectId(req.user.id) },
//         { $set: profileDetails },
//         { new: true }
//       ).populate("user", ["-password"]);
//       res.status(200).send(newProfile);
//     }
//   }
// );

router.get("/verify", function (req, res) {
  console.log("New verify request...");
  var id = req.param("id");
  // var phone = req.param('phone');
  var token = req.param("token");

  authy.verify(id, token, function (verifyErr, verifyRes) {
    console.log("In Verification...");
    if (verifyErr) {
      console.log(verifyErr);
      res.send("OTP verification failed.");
    } else if (verifyRes) {
      console.log(verifyRes);
      res.send("OTP Verified.");
    }
  });
});

router.get("/all", (req, res, next) => {
  Text.find()
    .select("_id email phone countryCode id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        Text: docs.map((doc) => {
          return {
            _id: doc._id,
            email: doc.email,
            phone: doc.phone,
            countryCode: doc.countryCode,
            id: doc.id,
          };
        }),
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
//add

//@Route api/profile/:id
router.get("/:id", async (req, res) => {
  console.log("user id", req.params.id);

  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const profile = await Profile.findOne({
      user: mongoose.Types.ObjectId(req.params.id),
    }).populate("user", ["-password"]);
    console.log("before", profile);

    if (profile === null) {
      let userDetail = await User.find({ _id: req.params.id }).select([
        "-password",
      ]);

      console.log(userDetail);

      //set demo fields
      const profile = {
        user: {
          name: userDetail[0].name,
          email: userDetail[0].email,
          _id: userDetail[0]._id,
        },
        country: "",
        address: "",
        about: "",
        mobile: "",
        skype: "",
        website: "",
        socialMedia: {
          facebook: "http://www.facebook.com",
          twitter: "http://www.twitter.com",
          linkedin: "http://www.linkedin.com",
        },
      };

      console.log("demo profile", profile);

      res.status(200).send(profile);
    } else {
      res.status(200).send(profile);
    }
  } else {
    res.status(400).send("Not found");
  }
});

// @Route api/profile/user/current
router.get(
  "/user/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // console.log("current id = ", req.user.id);

    const profile = await Profile.findOne({
      user: mongoose.Types.ObjectId(req.user.id),
    }).populate("user", ["-password"]);
    const totalCount = await Property.find({
      user: mongoose.Types.ObjectId(req.user.id),
    }).countDocuments();
    console.log(profile);

    if (profile === null) {
      console.log("yes its null");
      //set demo fields
      const profile = {
        country: "",
        address: "",
        about: "",
        mobile: "",
        skype: "",
        website: "",
        socialMedia: {
          facebook: "www.facebook.com",
          twitter: "www.twitter.com",
          linkedin: "www.linkedin.com",
        },
      };
      console.log(profile);

      res.status(200).send({ profile, totalCount });
    } else {
      res.status(200).send({ profile, totalCount });
    }
  }
);

// Get images from database
router.get("/imagePost", (req, res) => {
  db.find({}, (err, data) => {
    if (err) return res.status(500).send(err);

    res.json(data);
  });
});

// router.post('/imageUpdate', multipartMiddleware, (req, res) => {
//   // Upload image
//   cloudinary.v2.uploader.upload(req.files.image.path, {}, function(
//     error,
//     result
//   ) {
//     if (error) {
//       return res.status(500).send(error);
//     }
//     // Save record
//     db.insert(Object.assign({}, result, req.body), (err, newDoc) => {
//       if (err) {
//         return res.status(500).send(err);
//       }
//       // Emit realtime event
//       pusher.trigger('gallery', 'upload', {
//         image: newDoc,
//       });
//       res.status(200).json(newDoc);
//     });
//   });
// });
//

router.post("/imageUpdate", upload.single("image"), async (req, res, next) => {
  let fileName = new Date().getTime().toString() + ".jpg";
  let imagePath = path.join(__dirname, "../", "public", "images", fileName);
  try {
    await sharp(req.file.path)
      .resize(600, 400)
      .jpeg({
        quality: 80,
        chromaSubsampling: "4:4:4",
      })
      .toFile(imagePath, (err, resizeImage) => {
        if (err) {
          console.log(err);
        } else {
          console.log(resizeImage);
        }
      });
    return res.status(201).json({
      message: "File uploded successfully",
      fileName,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
