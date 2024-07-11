// Import required modules
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
require("dotenv").config();

// Find out the port
const PORT = process.env.PORT || 3000;

// Add middleware
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:'/tmp/'
}));

// Connect to DB
const db = require("./config/database");
db.connect();

// Connect to cloud
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// Routes
const Upload = require("./routes/FileUpload");
app.use('/api/v1/upload', Upload); // Mount Routes

// Activate Server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
