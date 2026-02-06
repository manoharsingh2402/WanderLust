const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const razorpayInstance = require("../razorpayConfig.js");
const crypto = require("crypto");

// Render booking form
module.exports.renderBookingForm = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        res.render("listings/booking.ejs", { listing });
    } catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};

// Create Razorpay order
module.exports.createOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkInDate, checkOutDate, numberOfGuests } = req.body;
        
        // Validate input
        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Check-in and check-out dates are required"
            });
        }
        
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }
        
        // Calculate number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (numberOfNights <= 0) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date"
            });
        }
        
        // Calculate total price (in paise for Razorpay)
        const totalPrice = listing.price * numberOfNights;
        const amountInPaise = totalPrice * 100; // Convert to paise
        
        // Create Razorpay order
        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `booking_${Date.now()}`,
            payment_capture: 1, // Auto capture payment
        };
        
        const order = await razorpayInstance.orders.create(options);
        
        // Create booking document in database
        const booking = new Booking({
            listing: id,
            user: req.user._id,
            checkInDate,
            checkOutDate,
            numberOfNights,
            numberOfGuests: numberOfGuests || 1,
            totalPrice,
            razorpayOrderId: order.id,
        });
        
        await booking.save();
        
        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            booking: {
                id: booking._id,
                totalPrice: booking.totalPrice,
            },
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating payment order"
        });
    }
};

// Verify payment and save booking
module.exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            booking_id 
        } = req.body;
        
        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed. Invalid signature."
            });
        }
        
        // Update booking with payment details
        const booking = await Booking.findByIdAndUpdate(
            booking_id,
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paymentStatus: "completed",
                updatedAt: Date.now(),
            },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        
        res.json({
            success: true,
            message: "Payment verified successfully",
            booking: booking,
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
};

// Get all bookings for logged-in user
module.exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .sort({ createdAt: -1 });
        
        res.render("listings/bookings/mybookings.ejs", { bookings });
    } catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
};

// Get booking details
module.exports.getBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate("listing")
            .populate("user");
        
        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("/listings/bookings/mybookings");
        }
        
        // Check if user is the owner of the booking
        if (booking.user._id.toString() !== req.user._id.toString()) {
            req.flash("error", "You don't have permission to view this booking");
            return res.redirect("/listings/bookings/mybookings");
        }
        
        res.render("listings/booking-details.ejs", { booking });
    } catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings/bookings/mybookings");
    }
};

// Cancel booking
module.exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        
        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("/listings/bookings/mybookings");
        }
        
        if (booking.user.toString() !== req.user._id.toString()) {
            req.flash("error", "You don't have permission to cancel this booking");
            return res.redirect("/listings/bookings/mybookings");
        }
        
        if (booking.paymentStatus === "cancelled") {
            req.flash("error", "This booking is already cancelled");
            return res.redirect("/listings/bookings/mybookings");
        }
        
        booking.paymentStatus = "cancelled";
        booking.updatedAt = Date.now();
        await booking.save();
        
        req.flash("success", "Booking cancelled successfully");
        res.redirect("/listings/bookings/mybookings");
    } catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong while cancelling booking");
        res.redirect("/listings/bookings/mybookings");
    }
};
