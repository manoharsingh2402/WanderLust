# 🏡 WanderLust

**A full-stack travel and accommodation booking platform**

WanderLust is a modern web application that allows users to discover, list, and book unique accommodations around the world. Built with the MEN stack (MongoDB, Express.js, Node.js) and EJS templating.

## 🌐 Live Demo

**Visit:** [https://wanderlust-3-lc3j.onrender.com/](https://wanderlust-3-lc3j.onrender.com/)

---

## ✨ Features

### For Guests
- 🔍 Browse and search accommodation listings
- 🗺️ Interactive map integration for location viewing
- 📝 View detailed property information with images
- 💬 Read and write reviews for properties
- 💳 Secure payment integration with Razorpay (Test Mode)
- 📱 Responsive design for all devices
- 👤 User authentication and profile management

### For Hosts
- 🏠 Create and manage property listings
- 📸 Upload multiple images for properties
- ✏️ Edit and delete your listings
- 📊 Track bookings and manage reservations
- 💰 Receive payments securely

### Technical Features
- 🔐 Secure authentication with Passport.js
- 🗄️ MongoDB database with Mongoose ODM
- ☁️ Image storage with Cloudinary
- 🛡️ Input validation and sanitization
- 🚨 Error handling and flash messages
- 📍 Location validation and mapping

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Frontend
- **EJS** - Templating engine
- **Bootstrap** - CSS framework
- **JavaScript** - Client-side scripting

### Authentication & Security
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **Connect Flash** - Flash messages
- **Joi** - Schema validation

### Payment & Storage
- **Razorpay** - Payment gateway integration
- **Cloudinary** - Image upload and storage
- **Multer** - File upload middleware

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas account)
- **npm** or **yarn**

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/manoharsingh2402/WanderLust.git
cd WanderLust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
ATLASDB_URL=your_mongodb_connection_string

# Cloudinary (for image uploads)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Session Secret
SECRET=your_session_secret_key

# Optional: Map API
MAP_TOKEN=your_mapbox_token
```

### 4. Run the application

**Development mode:**
```bash
npm start
```

**Production mode:**
```bash
NODE_ENV=production npm start
```

The app will be running at `http://localhost:8080`

---

## 📁 Project Structure

```
WanderLust/
├── models/              # Mongoose models
│   ├── listing.js       # Listing schema
│   ├── review.js        # Review schema
│   └── user.js          # User schema
├── routes/              # Express routes
│   ├── listing.js       # Listing routes
│   ├── review.js        # Review routes
│   └── user.js          # User routes
├── views/               # EJS templates
│   ├── listings/        # Listing views
│   ├── users/           # User views
│   └── layouts/         # Layout templates
├── public/              # Static files
│   ├── css/            # Stylesheets
│   └── js/             # Client-side scripts
├── middleware.js        # Custom middleware
├── schema.js           # Joi validation schemas
├── cloudConfig.js      # Cloudinary configuration
├── razorpayConfig.js   # Razorpay configuration
├── app.js              # Main application file
└── package.json        # Dependencies
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ATLASDB_URL` | MongoDB connection string | Yes |
| `CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUD_API_KEY` | Cloudinary API key | Yes |
| `CLOUD_API_SECRET` | Cloudinary API secret | Yes |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | Yes |
| `SECRET` | Session secret for security | Yes |
| `MAP_TOKEN` | Mapbox access token (optional) | No |

---

## 💳 Payment Integration

WanderLust uses **Razorpay** for secure payment processing.

### Test Mode Credentials:

**Credit/Debit Card:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)

**UPI:**
- UPI ID: `success@razorpay` (for successful payment)
- UPI ID: `failure@razorpay` (for failed payment)

**OTP:** Any 6-digit number in test mode

---

## 📸 Screenshots

<!-- Add your screenshots here -->
_Coming soon..._

---

## 🗺️ API Routes

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Show create listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View single listing
- `GET /listings/:id/edit` - Show edit form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Add review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Signup form
- `POST /signup` - Register user
- `GET /login` - Login form
- `POST /login` - Login user
- `GET /logout` - Logout user

### Payments
- `POST /payment/create-order` - Create Razorpay order
- `POST /payment/verify-payment` - Verify payment signature

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Manohar Singh**

- GitHub: [@manoharsingh2402](https://github.com/manoharsingh2402)
- Project Link: [https://github.com/manoharsingh2402/WanderLust](https://github.com/manoharsingh2402/WanderLust)

---

## 🙏 Acknowledgments

- Inspired by Airbnb
- Icons from [Font Awesome](https://fontawesome.com)
- Images from [Unsplash](https://unsplash.com)
- Maps powered by Mapbox

---

## 🐛 Known Issues

- None currently reported

## 📮 Contact

For any queries or suggestions, feel free to reach out or open an issue on GitHub.

---

**⭐ If you like this project, please give it a star!**
