require("dotenv").config();
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

// app.post("/video/upload", async (req, res) => {
//   const storage = multer.diskStorage({
//     filename: (req, file, cb) => {
//       const fileExt = file.originalname.split(".").pop();
//       const filename = `${new Date().getTime()}.${fileExt}`;
//       cb(null, filename);
//     },
//   });

//   // Filter the file to validate if it meets the required video extension
//   const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "video/mp4") {
//       cb(null, true);
//     } else {
//       cb(
//         {
//           message: "Unsupported File Format",
//         },
//         false
//       );
//     }
//   };

//   // Set the storage, file filter and file size with multer
//   const upload = multer({
//     storage,
//     limits: {
//       fieldNameSize: 200,
//       fileSize: 30 * 1024 * 1024,
//     },
//     fileFilter,
//   }).single("video");

//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).send(err);
//     }
//   });

//   // SEND FILE TO CLOUDINARY
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   const { path } = req.file;
//   const fName = req.file.originalname.split(".")[0];
//   cloudinary.uploader.upload(
//     path,
//     {
//       resource_type: "video",
//       public_id: `VideoUploads${fName}`,
//       chunk_size: 6000000,
//       eager: [
//         {
//           width: 3000,
//           height: 300,
//           crop: "pad",
//           audio_codec: "none",
//         },
//         {
//           width: 160,
//           height: 100,
//           crop: "crop",
//           gravity: "south",
//           audio_codec: "none",
//         },
//       ],
//     },

//     // Send cloudinary response or catch error
//     (err, video) => {
//       if (err) return res.status(400).send(err);

//       fs.unlinkSync(path);
//       return res.status(200).send(video);
//     }
//   );
// });

//...

app.post("/video/upload", async (req, res) => {
  // Get the file name and extension with multer
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      const filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
  });

  // Filter the file to validate if it meets the required video extension
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(
        {
          message: "Unsupported File Format",
        },
        false
      );
    }
  };

  // Set the storage, file filter and file size with multer
  const upload = multer({
    storage,
    limits: {
      fieldNameSize: 200,
      fileSize: 30 * 1024 * 1024,
    },
    fileFilter,
  }).single("video");

  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    // SEND FILE TO CLOUDINARY
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const { path } = req.file; // file becomes available in req at this point

    const fName = req.file.originalname.split(".")[0];
    cloudinary.uploader.upload(
      path,
      {
        resource_type: "video",
        public_id: `VideoUploads/${fName}`,
        chunk_size: 6000000,
        eager: [
          {
            width: 300,
            height: 300,
            crop: "pad",
            audio_codec: "none",
          },
          {
            width: 160,
            height: 100,
            crop: "crop",
            gravity: "south",
            audio_codec: "none",
          },
        ],
      },

      // Send cloudinary response or catch error
      (err, video) => {
        if (err) return res.send(err);

        // fs.unlinkSync(path);
        return res.send(video);
      }
    );
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
