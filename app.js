const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
// const config = require("config");
const app = express();

// console.log(config.get("apiSecret"));
cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: "",
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
  try {
    console.log("The file", req.file);
    return res.json({ picture: req.file.path });
  } catch (ex) {
    res.status(500).send("Something went wrong !");
    console.log("The error", ex);
  }
});

app.post("/withCloudinary/", (req, res) => {
  cloudinary.uploader
    .upload("./videos/vid1.mkv", {
      resource_type: "video",
      chunk_size: 6000000,
    })
    .then((result) => {
      res.status(200).send("Received");
      console.log("success", JSON.stringify(result, null, 2));
    })
    .catch((ex) => {
      res.status(500).send("Something went wrong!");
      console.log("error", JSON.stringify(ex, null, 2));
    });
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
