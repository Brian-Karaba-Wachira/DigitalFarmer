const express = require("express");
const router = express.Router();
const { createListing, getListings, claimListing } = require("../controllers/listingsController");

// POST new listing
router.post("/", createListing);

// GET all listings
router.get("/", getListings);

// PATCH claim listing
router.patch("/:id/claim", claimListing);

module.exports = router;
