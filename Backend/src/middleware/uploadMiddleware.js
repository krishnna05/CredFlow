const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// 1. Cloudinary Storage 
const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "credflow/invoices",
    resource_type: "auto", 
    allowed_formats: ["pdf", "jpg", "png", "jpeg"],
  },
});

const memoryStorage = multer.memoryStorage();

const uploadCloud = multer({ storage: cloudStorage });
const uploadMemory = multer({ 
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = { uploadCloud, uploadMemory };