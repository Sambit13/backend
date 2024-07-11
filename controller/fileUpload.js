const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const File = require("../models/File");

// Local file upload handler function
exports.localFileUpload = async (req, res) => {
    try {
        // Fetch file from the request
        const file = req.files.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        console.log("File received ->", file);

        // Define the path where the file will be stored
        const uploadDir = path.join(__dirname, "files");
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Create path where file needs to be stored on server
        const filePath = path.join(uploadDir, `${Date.now()}.${path.extname(file.name).slice(1)}`);
        console.log("File will be stored at ->", filePath);

        // Move the file to the specified path
        file.mv(filePath, (err) => {
            if (err) {
                console.error("Error moving file:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading file",
                    error: err
                });
            }
            res.json({
                success: true,
                message: "Local file uploaded successfully"
            });
        });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploquadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Image upload handler
exports.imageUpload = async (req, res) => {
    try {
        // Data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);
        const file = req.files.imageFile;
        console.log(file);

        // Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = path.extname(file.name).slice(1).toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        // Now if file is supported then upload file to Cloudinary
        const response = await uploadFileToCloudinary(file, "codehelp");
        console.log(response);

        // Assuming the response contains a URL to the uploaded image
        const imageUrl = response.secure_url;

        // Save entries in Database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image uploaded successfully',
            data: fileData
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

// Video upload handler
exports.videoUpload = async (req, res) => {
    try {
        // Data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;
        const supportedTypes = ["mp4", "mov"];
        const fileType = path.extname(file.name).slice(1).toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        // Now if file is supported then upload file to Cloudinary
        console.log("Uploading to codeHelp");
        const response = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "codehelp",
            resource_type: "auto"
        });
        console.log(response);

        // Save entries in Database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Video uploaded successfully',
            data: fileData
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

// Image size reducer handler
exports.imageSizeReducer = async (req, res) => {
    try {
        // Data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = path.extname(file.name).slice(1).toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        // Now if file is supported then upload file to Cloudinary with quality reduction
        console.log("Uploading to codeHelp with reduced quality");
        const response = await uploadFileToCloudinary(file, "codehelp", 90);
        console.log(response);

        // Save entries in Database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image uploaded and size reduced successfully',
            data: fileData
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};
