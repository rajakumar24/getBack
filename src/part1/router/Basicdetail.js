const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Basicdetail = require('../models/Basicdetails');
// const BasicDetail1 = require('../models/Basicdetails1');
// const BasicDetail2 = require('../models/Basicdetails2');
// const BasicDetail3 = require('../models/Basicdetails3');
// const BasicDetail6 = require('../models/Basicdetails6');

// const storage = multer.diskStorage({
//   destination: '../../uploads',
//   filename: function(req, file, cb){
//      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
//   }
// });


// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, './uploads')
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, Date.now() + '-' +file.originalname)
//     }
//   })
// `File_${file.originalname}`
// const upload = multer({ storage: storage }).single('file')


//   const upload = multer({
//     storage: storage,
//     limits:{fileSize: 1000000},
//  }).single("myImage");

router.post('/list-your-property', (req, res, next) => {
  //  console.log(req.file);
  const user = new Basicdetail({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    person: req.body.person,
    rera_id: req.body.rera_id,
    rera_url: req.body.rera_url,
    Listmy_propertyfor: req.body.Listmy_propertyfor,
    Available_for: req.body.Available_for,
    Typeof_property: req.body.Typeof_property,
    Property_status: req.body.Property_status,
    Possession_from: req.body.Possession_from,
  });
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)
    } else {
      console.log(registeredUser);
      return res.status(200).json({

        message: "successfully uploaded property details"
      });
    }
  })

});


// router.post('/list-your-property1', (req, res, next) => {
//   console.log(req.file);
//   const user = new BasicDetail({
//     _id: new mongoose.Types.ObjectId(),
//   name:req.body.name,
//   email:req.body.email,
//   mobile:req.body.mobile,
// person:req.body.person,

//     rera_id:req.body.rera_id,
//     rera_url:req.body.rera_url,


// Listmy_propertyfor:req.body.Listmy_propertyfor,
// Available_for:req.body.Available_for,
// Typeof_property:req.body.Typeof_property,
// Property_status:req.body.Property_status,
// Possession_from:req.body.Possession_from,
// Available_from:req.body.Available_from,
// Bachelors_allowed:req.body.Bachelors_allowed,
// Pets_allowed:req.body.Pets_allowed,
// Nonveg_allowed:req.body.Nonveg_allowed
//  });
//   user.save((err, registeredUser) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(registeredUser);
//       return res.status(200).json({

//         message: "successfully uploaded property details"
//       });
//     }
//   })

// });

// person city state Building_area Bhk Carpet_Area BuiltUp_Area Sale_price

// router.get('/list-your-property1',(req, res, next) => {

//   BasicDetail.find({ name: req.body.username,   email: req.body.email,  mobile: req.body.mobile})

//     .exec()
//     .then(docs => {
//       const response = {
//         count: docs.length,
//         BasicDetail: docs.map(doc => {
//           return {
//             name: doc.name,
//             email:doc.email,
//             mobile:doc.mobile,
//          };
//         })
//       };
//         if (docs.length >= 0) {
//       res.status(200).json(response);
//         } else {
//             res.status(404).json({
//                 message: 'No entries found'
//             });
//         }
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

router.post('/list-your-property2', (req, res, next) => {
  console.log(req.file);
  const user = new BasicDetail2({
    _id: new mongoose.Types.ObjectId(),
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    Building_area: req.body.Building_area,


  });
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)
    } else {
      console.log(registeredUser);
      return res.status(200).json({

        message: "successfully uploaded property details"
      });
    }
  })

});


router.post('/list-your-property3', (req, res, next) => {
  console.log(req.file);
  const user = new BasicDetail3({
    _id: new mongoose.Types.ObjectId(),
    Bhk: req.body.Bhk,
    Carpet_Area: req.body.Carpet_Area,
    BuiltUp_Area: req.body.BuiltUp_Area,
    Sale_price: req.body.Sale_price,
    Price_negotiable: req.body.Price_negotiable,
    Include_registration: req.body.Include_registration,
    Bathrooms: req.body.Bathrooms,
    Frunish_status: req.body.Frunish_status,
    Reserved_parking: req.body.Reserved_parking,
    total_floors: req.body.total_floors,
    property_on_floor: req.body.property_on_floor,
    Balconices: req.body.Balconices,
    Description: req.body.Description,
  });
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)
    } else {
      console.log(registeredUser);
      return res.status(200).json({

        message: "successfully uploaded property details"
      });
    }
  })

});



router.post('/list-your-property5', (req, res, next) => {
  console.log(req.file);
  const user = new BasicDetail1({
    _id: new mongoose.Types.ObjectId(),
    premiumName: req.body.premiumName,
  });
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)
    } else {
      console.log(registeredUser);
      return res.status(200).json({

        message: "successfully uploaded property details"
      });
    }
  })

});

router.post('/list-your-property6', (req, res, next) => {
  console.log(req.file);
  const user = new BasicDetail6({
    _id: new mongoose.Types.ObjectId(),
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)
    } else {
      console.log(registeredUser);
      return res.status(200).json({

        message: "successfully uploaded property details"
      });
    }
  })

});

router.get('/list-your-property', (req, res, next) => {
  Basicdetail.find()
    .select("name email mobile person rera_id rera_url Listmy_propertyfor Available_for Typeof_property Property_status Possession_from")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        Basicdetail: docs.map(doc => {
          return {
            name: doc.name,
            email: doc.email,
            mobile: doc.mobile,
            person: doc.person,
            rera_id: doc.rera_id,
            rera_url: doc.rera_url,
            Listmy_propertyfor: doc.Listmy_propertyfor,
            Available_for: doc.Available_for,
            Typeof_property: doc.Typeof_property,
            Property_status: doc.Property_status,
            Possession_from: doc.Possession_from
          };
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: 'No entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.get('/list-your-property/:userId', (req, res, next) => {
  const id = req.params.userId;
  Basicdetail.findById(id)
    .select("files")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          Builder: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/list-your-property"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


module.exports = router;



