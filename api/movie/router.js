const router = require("express").Router();
const Movies = require("./model");
const cloudinary = require("cloudinary").v2;

router.get("/", async (req, res, next) => {
  Movies.find()
    .exec()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch(next);
});

router.get("/:movie_id", async (req, res, next) => {
  Movies.findById(req.params.movie_id)
    .exec()
    .then((movie) => {
      console.log("movie", movie);
      res.status(200);
      res.send(`<h1>${movie.title}</h1>
      <img src=${movie.image_url}>
      <video><source src=${movie.video_url} type="video/mp4" controls></video>
      `);
    })
    .catch(next);
});

router.put("/:movie_id", async (req, res, next) => {
  const bodyReducer = Object.keys(req.body).reduce((acc, curr) => {
    acc[curr] = req.body[curr];
    return acc;
  }, {});
  Movies.findByIdAndUpdate(req.params.movie_id, bodyReducer)
    .exec()
    .then(() => {
      res.status(200).json(updatedMovie);
    })
    .catch(next);
});

router.post("/", async (req, res, next) => {
  const { image_url, video_url } = req.body;

  const cloudinaryImageUploadMethod = async (file) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(file, (err, res) => {
        if (err) return res.status(500).send("upload image error");
        console.log(res.secure_url);
        resolve(res.secure_url);
      });
    });
  };
  const imageLink = await cloudinaryImageUploadMethod(image_url);
  cloudinary.uploader
    .upload(video_url, { resource_type: "video", chunk_size: 6000000 })
    .then((result) => {
      console.log("video:", result);
      new Movies({
        ...req.body,
        image_url: imageLink,
        video_url: result.secure_url,
      })
        .save()
        .then((newMovie) => {
          res.status(201).json(newMovie);
        })
        .catch(next);
    })

    .catch(next);
});

router.delete("/:movie_id", async (req, res, next) => {
  Movies.findByIdAndDelete(req.params.movie_id, { activ: false })
    .exec()
    .then((removeMovie) => {
      res.status(200).json(removeMovie);
    })
    .catch(next);
});

module.exports = router;
