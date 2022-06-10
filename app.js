const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const app = express();

cloudinary.config({
  cloud_name: "dhc9vwlnl",
  api_key: "426828191188413",
  api_secret: "nxeLk8PQqVgLa9BO-aEUve9jUpY",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  return res.json({ message: "Hello World 🇵🇹 🙌" });
});

app.post("/", upload.single("picture"), async (req, res) => {
  console.log("The file", req.file);
  return res.json({ picture: req.file.path });
});

const start = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Api up and running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
start(5000);
