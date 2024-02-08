const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingController = require("../controllers/listing.js");
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Multer require.dest means distination)
const multer  = require('multer')
const {storage}= require("../cloudConfig.js");
const upload = multer({storage });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//( Get/listing =>All Listing)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Router.router are used)
router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(
   isLoggedIn,
   upload.single("listing[image]"),
   validateListing,
   wrapAsync(listingController.createListing)
   );

  //  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // (upload.single("listing[image]") => Multer process or req.file me data le aayga)
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Index Route:)
// router.get(
//   "/",
//   wrapAsync(listingController.index)
// );
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (New Route)
router.get("/new"
,isLoggedIn,
listingController.renderNewForm);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Show route) 
router.get("/:id",
wrapAsync(listingController.showListing)
);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Create Route)
router.post("/",
isLoggedIn,
validateListing,
wrapAsync(listingController.createListing)
);


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Edit Route)
router.get(
    "/:id/edit",
    isOwner,
    isLoggedIn,
    wrapAsync(listingController.renderEditForm)
  );


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Update Route)
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  );
  
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(Delete Route)
  router.delete(
    "/:id",
    
    wrapAsync(listingController.destroyListing)
  );

  module.exports= router;