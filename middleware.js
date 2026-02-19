const ExpressError = require("./utils/ExpressError.js");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const { listingSchema, reviewSchema } = require("./schema.js");


// ===============================
// ✅ LOGIN CHECK MIDDLEWARE
// ===============================
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {

    // redirect URL save
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }

  next();
};


// ===============================
// ✅ SAVE REDIRECT URL
// ===============================
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


// ===============================
// ✅ LISTING VALIDATION
// ===============================
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }

  next();
};


// ===============================
// ✅ REVIEW VALIDATION
// ===============================
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }

  next();
};


// ===============================
// ✅ LISTING OWNER AUTHORIZATION
// ===============================
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


// ===============================
// ✅ REVIEW AUTHOR AUTHORIZATION
// ===============================
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }

  next(); // ✅ MUST
};
