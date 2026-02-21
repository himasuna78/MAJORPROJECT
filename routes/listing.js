const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ Validation Middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }

  next();
};

// ======================
// ✅ INDEX + CREATE ROUTE
// ======================
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// ======================
// ✅ NEW FORM ROUTE
// ======================
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ======================
// ✅ SHOW + UPDATE + DELETE ROUTE
// ======================
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

// ======================
// ✅ EDIT FORM ROUTE
// ======================
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
