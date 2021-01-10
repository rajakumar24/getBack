//
require("dotenv").config();

const fast2sms = require("fast-two-sms");
const multipart = require("connect-multiparty");
const cloudinary = require("cloudinary");
const Datastore = require("nedb");
const Pusher = require("pusher");
var nodemailer = require("nodemailer");
//
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const passport = require("passport");

//Load Property model
const Property = require("../models/Property");

//Load property validator
const validatePropertyInput = require("../validation/property");

//
var transporter = nodemailer.createTransport({
  service: "gmail",
  //smtp.gmail.com  //in place of service use host...

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});
//
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
//
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

// Get images from database
router.get("/getImages", (req, res) => {
  db.find({}, (err, data) => {
    if (err) return res.status(500).send(err);

    res.json(data);
  });
});

// router.post('/upload', multipartMiddleware, (req, res) => {
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
router.post("/upload", upload.single("image"), async (req, res, next) => {
  const qww = req.file.originalname;
  let fileName = req.file.originalname + ".jpg";
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
      message: "File uploded successbvbnbfully",
      fileName,
    });
  } catch (error) {
    console.error(error);
  }
});
//

//add new property
//@Route /api/property/add
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePropertyInput(req.body);

    if (!isValid) {
      return res.status(400).send(errors);
    }

    const PropertyDetails = {
      user: req.user.id,
      title: req.body.title,
      imgUrl: req.body.imgUrl,
      price: req.body.price,
      description: req.body.description,
      address: req.body.address,
      mapLocation: {
        lat: req.body.lat,
        lng: req.body.lng,
      },
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
      propertyType: req.body.propertyType,
      status: req.body.status,
      beds: req.body.beds,
      baths: req.body.baths,
      area: req.body.area,
      garages: req.body.garages,
      features: {
        ac: req.body.ac ? true : false,
        gym: req.body.gym ? true : false,
        bar: req.body.bar ? true : false,
        internet: req.body.internet ? true : false,
        microwave: req.body.microwave ? true : false,
        smoking: req.body.smoking ? true : false,
        fireplace: req.body.fireplace ? true : false,
        toaster: req.body.toaster ? true : false,
        tennis: req.body.tennis ? true : false,
        tv: req.body.tv ? true : false,
      },
      approve: req.body.approve,
      question: req.body.question,
      answer: req.body.answer,
      reviewTitle: req.body.reviewTitle,
      reviewDes: req.body.reviewDes,
      //   obej:[{
      //     answer: req.body.answer,
      //     question: req.body.question
      //   }
      //  ],
    };

    const property = await Property.findOne({ title: PropertyDetails.title });

    if (property) {
      return res
        .status(400)
        .send({ title: "property should have unique title." });
    } else {
      const newProperty = await new Property(PropertyDetails).save();

      res
        .status(200)
        .send({ newProperty, msg: "property added successfully!" });
    }
  }
);

//add
//add new Admin property
//@Route /api/property/AdminMaster
router.post(
  "/AdminMaster",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePropertyInput(req.body);

    if (!isValid) {
      return res.status(400).send(errors);
    }

    const PropertyDetails = {
      user: req.user.id,
      title: req.body.title,
      imgUrl: req.body.imgUrl,
      price: req.body.price,
      description: req.body.description,
      address: req.body.address,
      mapLocation: {
        lat: req.body.lat,
        lng: req.body.lng,
      },
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
      propertyType: req.body.propertyType,
      status: req.body.status,
      beds: req.body.beds,
      baths: req.body.baths,
      area: req.body.area,
      garages: req.body.garages,
      features: {
        ac: req.body.ac ? true : false,
        gym: req.body.gym ? true : false,
        bar: req.body.bar ? true : false,
        internet: req.body.internet ? true : false,
        microwave: req.body.microwave ? true : false,
        smoking: req.body.smoking ? true : false,
        fireplace: req.body.fireplace ? true : false,
        toaster: req.body.toaster ? true : false,
        tennis: req.body.tennis ? true : false,
        tv: req.body.tv ? true : false,
      },
      approve: req.body.approve,
    };

    const property = await Property.findOne({ title: PropertyDetails.title });

    if (property) {
      return res
        .status(400)
        .send({ title: "property should have unique title." });
    } else {
      const newProperty1 = await new Property(PropertyDetails).save();

      res
        .status(200)
        .send({ newProperty1, msg: "property added successfully!" });
    }
  }
);
//add

router.post("/enquiry", async (req, res, next) => {
  try {
    const enquiryDetails = {
      nameEnquiry: req.body.nameEnquiry,
      emailEnquiry: req.body.emailEnquiry,
      mobileEnquiry: req.body.mobileEnquiry,
    };
    console.log("hi");
    const message =
      "Hello! " +
      `${enquiryDetails.nameEnquiry}` +
      " has requested to call back. Please Contact at mailId " +
      `${enquiryDetails.emailEnquiry}` +
      " & Contact " +
      `${enquiryDetails.mobileEnquiry}`;
    const response = await fast2sms.sendMessage({
      authorization: process.env.API_KEY,
      message: message,
      numbers: ["9916785065", "9064057801"],
    });
    res.send(response);

    var mailOptions = {
      from: process.env.EMAIL,
      to: req.body.emailEnquiry,
      subject: "Lead",
      html:
        "<h1>Welcome To Get Right Property ! </h1><p>\
      <h3>Hello " +
        req.body.nameEnquiry +
        "</h3>\
      Thank You for requesting call back with Us. <br/>\
      Our Admin will contact you shortly! \
      </p>",
    };
    const responses = await transporter.sendMail(
      mailOptions,
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.send(responses); // User.updateOne({email: userData.email}, {
          //     token: currentDateTime,

          // },  {multi:true},function(err, affected, resp) {
          return res.status(200).json({
            success: false,
            msg: info.response,
            userlist: resp,
          });

          // })
        }
      }
    );
  } catch (err) {
    next(err);
  }
});
//add

//update property
//@Route /api/property/update
router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePropertyInput(req.body);

    if (!isValid) {
      return res.status(400).send(errors);
    }

    const PropertyDetails = {
      title: req.body.title,
      imgUrl: req.body.imgUrl,
      price: req.body.price,
      description: req.body.description,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
      propertyType: req.body.propertyType,
      status: req.body.status,
      beds: req.body.beds,
      baths: req.body.baths,
      area: req.body.area,
      garages: req.body.garages,
      features: {
        ac: req.body.ac ? true : false,
        gym: req.body.gym ? true : false,
        bar: req.body.bar ? true : false,
        internet: req.body.internet ? true : false,
        microwave: req.body.microwave ? true : false,
        smoking: req.body.smoking ? true : false,
        fireplace: req.body.fireplace ? true : false,
        toaster: req.body.toaster ? true : false,
        tennis: req.body.tennis ? true : false,
        tv: req.body.tv ? true : false,
      },
    };

    console.log("new data", PropertyDetails);

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const property = await Property.findOne({ _id: req.body.id });

      if (property) {
        const newProperty = await Property.findByIdAndUpdate(
          req.body.id,
          { $set: { ...PropertyDetails } },
          { new: true }
        );

        res.status(200).send(newProperty);
      }
    } else {
      res.status(400).send("not found");
    }
  }
);

//add
// router.put('/api/property/:id', function (req, res) {
router.put("/:id", function (req, res) {
  const id = req.body.id;

  const PropertyDetails = {
    title: req.body.title,
    imgUrl: req.body.imgUrl,
    price: req.body.price,
    description: req.body.description,
    address: req.body.address,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    zip: req.body.zip,
    propertyType: req.body.propertyType,
    status: req.body.status,
    beds: req.body.beds,
    baths: req.body.baths,
    area: req.body.area,
    garages: req.body.garages,
    features: {
      ac: req.body.ac ? true : false,
      gym: req.body.gym ? true : false,
      bar: req.body.bar ? true : false,
      internet: req.body.internet ? true : false,
      microwave: req.body.microwave ? true : false,
      smoking: req.body.smoking ? true : false,
      fireplace: req.body.fireplace ? true : false,
      toaster: req.body.toaster ? true : false,
      tennis: req.body.tennis ? true : false,
      tv: req.body.tv ? true : false,
    },
    approve: req.body.approve,
    question: req.body.question,
    answer: req.body.answer,
    reviewDes: req.body.reviewDes,
    reviewTitle: req.body.reviewTitle,
    //   obej:[{
    //     answer: req.body.answer,
    //     question: req.body.question
    //   }
    //  ],
  };

  console.log("id", PropertyDetails);
  Property.findByIdAndUpdate(
    id,
    { $set: PropertyDetails },
    { new: true },
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error);
      } else {
        res.json(data);
      }
    }
  );
});

router.post("/:id", (req, res, next) => {
  try {
    const id = req.body.id;
    const PropertyDetails = {
      // title: req.body.title,
      // imgUrl: req.body.imgUrl,
      // price: req.body.price,
      // description: req.body.description,
      // address: req.body.address,
      // country: req.body.country,
      // lat: req.body.lat,
      // lng: req.body.lng,
      // state: req.body.state,
      // city: req.body.city,
      // zip: req.body.zip,

      // status: req.body.status,
      // beds: req.body.beds,
      // baths: req.body.baths,
      // area: req.body.area,
      // answer: req.body.answer,
      question: req.body.question,
    };
    // const property1 = Property.findOne({ title: PropertyDetails.title });
    const property = Property.findById({ _id: id });
    if (property) {
      const newProperty = Property(PropertyDetails)
        .save()
        .then((res) => {
          console.log("Saved ::");
        })
        .catch((err) => {
          console.log("Error", err);
        });
      res
        .status(200)
        .send({ newProperty, msg: "property added successfully!" });
    } else {
      return res
        .status(400)
        .send({ title: "property should have unique title." });
    }
  } catch (ex) {
    console.log("Error ::", ex);
  }
});

// for question in propertyPage
// router.put('/api/property/:id', function (req, res) {
//  router.put('/:id', function (req, res) {

//     const id = req.body.id;
//     const PropertyDetails = {
//       question: req.body.question
// title: req.body.title,
// imgUrl: req.body.imgUrl,
// price: req.body.price,
// description: req.body.description,
// address: req.body.address,
// country: req.body.country,
// state: req.body.state,
// city: req.body.city,
// zip: req.body.zip,
// propertyType: req.body.propertyType,
// status: req.body.status,
// beds: req.body.beds,
// baths: req.body.baths,
// area: req.body.area,
// garages: req.body.garages,
// features: {
//   ac: req.body.ac ? true : false,
//   gym: req.body.gym ? true : false,
//   bar: req.body.bar ? true : false,
//   internet: req.body.internet ? true : false,
//   microwave: req.body.microwave ? true : false,
//   smoking: req.body.smoking ? true : false,
//   fireplace: req.body.fireplace ? true : false,
//   toaster: req.body.toaster ? true : false,
//   tennis: req.body.tennis ? true : false,
//   tv: req.body.tv ? true : false
// },
// approve: req.body.approve
// };

//   console.log("id", PropertyDetails);
//   Property.findByIdAndUpdate(id, { $set: PropertyDetails }, { new: true }, (error, data) => {
//     if (error) {
//       return next(error);
//       console.log(error);
//     } else {
//       res.json(data)
//     }

//   });
// });

//add

//delete property
//@Route /api/property/delete
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const message = await Property.findByIdAndDelete({ _id: req.query.id });

    if (message) {
      res.status(200).send({ msg: "deleted" });
    } else {
      res.status(400).send({ msg: "not found" });
    }
  }
);

//get all properties
//@Route /api/property
router.get("/all", async (req, res) => {
  const currentPage = req.query.currentPage;
  const pageSize = req.query.pageSize;
  const filter = req.query.selectedFilter;
  // console.log("page size", currentPage, pageSize);

  if (filter === "rent" || filter === "sale") {
    const propertiesList = await Property.find({ status: filter })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize * 1)
      .sort({ date: -1 })
      .populate("user", ["-password"]);

    if (propertiesList.length > 0) {
      res.status(200).send(propertiesList);
    } else {
      res.status(400).send({ err: "not found" });
    }
  }
  if (filter === "all") {
    const propertiesList = await Property.find()
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize * 1)
      .sort({ date: -1 })
      .populate("user", ["-password"]);
    res.status(200).send(propertiesList);
  }
});

//get property with id
//@Route /api/property/:id

router.get("/:id", async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const propertyDetail = await Property.findOne({
      _id: req.params.id,
    }).populate("user", ["-password"]);
    console.log(propertyDetail);

    if (propertyDetail) {
      return res.status(200).send(propertyDetail);
    } else {
      return res.status(400).send({ msg: "not found" });
    }
  } else {
    res.status(400).send("Not found");
  }
});

//get total property count
//@Route /api/property/
router.get("/", async (req, res) => {
  if (req.query.filter === "rent" || req.query.filter === "sale") {
    const totalCount = await Property.find({
      status: req.query.filter,
    }).countDocuments();
    res.status(200).send({ totalCount: totalCount });
  }
  if (req.query.filter === "all") {
    const totalCount = await Property.find().countDocuments();
    res.status(200).send({ totalCount: totalCount });
  }
});
module.exports = router;
