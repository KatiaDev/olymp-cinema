const router = require("express").Router();
const News = require("./model");
const cloudinary = require("cloudinary").v2;
const { validateNews, checkNewsExists } = require("./middleware");
const { staffAccess } = require("../auth/middleware");

router.get("/", async (req, res, next) => {
  try {
    const news = await News.find().exec();
    res.status(200).json(news);
  } catch (err) {
    next(err);
  }
});

router.get("/:news_id", checkNewsExists, async (req, res, next) => {
  try {
    const foundArticle = await News.findById(req.params.news_id).exec();
    res.status(200).json(foundArticle);
  } catch (err) {
    next(err);
  }
});

router.post("/", staffAccess, validateNews, async (req, res, next) => {
  const { image_url } = req.body;

  cloudinary.uploader
    .upload(image_url, {
      folder: "news",
      use_filename: true,
    })
    .then((result) => {
      console.log("image:", result);

      new News({ ...req.body, image_url: result.secure_url })
        .save()
        .then((newArticle) => {
          res.status(201).json(newArticle);
        })
        .catch(next);
    })
    .catch(next);
});

router.put(
  "/:news_id",
  staffAccess,
  validateNews,
  checkNewsExists,
  async (req, res, next) => {
    const bodyReducer = Object.keys(req.body).reduce((acc, curr) => {
      if (req.body[curr]) {
        acc[curr] = req.body[curr];
      }
      return acc;
    }, {});
    try {
      const updatedArticle = await News.findByIdAndUpdate(
        req.params.news_id,
        bodyReducer
      ).exec();
      res.status(200).json(updatedArticle);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:news_id",
  staffAccess,
  checkNewsExists,
  async (req, res, next) => {
    try {
      const deletedArticle = await News.findByIdAndDelete(
        req.params.news_id
      ).exec();
      res.status(200).json(deletedArticle);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
