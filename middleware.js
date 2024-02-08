const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl= req.originalUrl;
      // console.log(req.session.redirectUrl); 
      // When click new listing /listings/new
        req.flash("error","you must be logged in to create login");
        return res.redirect("/login");
      }
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (If user authenticate then call next())
next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
  }
  next();
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Listing Edit or Delete only autorized only owner)
module.exports.isOwner= async(req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing does not exist");
    return res.redirect("/listings");
  }
  
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Validate for schema Middleware)
 module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    // Filter Error
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (VAlidate server side review Comment and rating)
module.exports.validateReview = (req,res,next)=>{
  let{error}= reviewSchema.validate(req.body);
  if(error){
    // Filter Error
    let errMsg= error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

// (Review Author)
module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you didn't create this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}