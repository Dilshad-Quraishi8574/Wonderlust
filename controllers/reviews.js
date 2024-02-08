const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reviews
//(Post Review Route)
module.exports.createReview=async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(newReview);
    res.redirect(`/listings/${listing._id}`);
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Delete Review Route:)
module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    // Pull the reviewId from the reviews array in the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Redirect to the listing page
   return res.redirect(`/listings/${id}`);
  }