const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// Render booking form
router.get("/:id/booking", isLoggedIn, wrapAsync(bookingController.renderBookingForm));

// Create Razorpay order
router.post("/:id/create-order", isLoggedIn, wrapAsync(bookingController.createOrder));

// Verify payment
router.post("/:id/verify-payment", isLoggedIn, wrapAsync(bookingController.verifyPayment));

// Get all bookings for logged-in user
router.get("/mybookings", isLoggedIn, wrapAsync(bookingController.getUserBookings));

// Get specific booking details
router.get("/booking/:id", isLoggedIn, wrapAsync(bookingController.getBookingDetails));

// Cancel booking
router.delete("/booking/:id/cancel", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
