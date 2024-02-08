const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Mapbox GeoCoding)
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN; // This should contain your Mapbox access token
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//( Get/listing =>All Listing)
// (Index Route:)
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  //    res.send("Get Working");
  res.render("listings/index.ejs", { allListings });
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (New Route)
module.exports.renderNewForm = (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Show route)
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Create Route)
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      // query: "New Delhi,India",
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // (Listing location ant query)
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ({ type: 'Point', coordinates: [ 77.209006, 28.613895 ] } its a geometry)
  let result = listingSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  // console.log(newListing.owner);
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing are created");
  res.redirect("/listings");
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Edit Route)
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("success", "Edit successfully");
    res.redirect("/listings");
    return;
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Update Route)
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "New Listing are update");
  res.redirect(`/listings/${id}`);
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(Delete Route)|| destroy route

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing are Deleted");
  res.redirect(`/listings`);
};
