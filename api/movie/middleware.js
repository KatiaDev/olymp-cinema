const { check, validationResult } = require("express-validator");
const Movies = require("./model");

const validateMovie = async (req, res, next) => {
  await check("title")
    .trim()
    .notEmpty()
    .withMessage("Movie title field can't be empty.")
    .isLength({ min: 3 })
    .withMessage("Movie title must have minimum length of 3.")
    .run(req);

  await check("genre")
    .notEmpty()
    .withMessage("Genre field can't be empty.")
    .run(req);

  await check("release_date")
    .trim()
    .notEmpty()
    .withMessage("Release date field can't be empty.")
    .isISO8601()
    .toDate()
    .withMessage("Wrong date format.")
    .run(req);

  await check("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 50 })
    .withMessage("description must have minimum length of 50 characters.")
    .run(req);

  await check("age_restrict")
    .trim()
    .notEmpty()
    .withMessage("Age restriction field is required.")
    .isIn(["AG", "AP-12", "N-15", "IM-18"])
    .withMessage("Undefined age restriction category.")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
  } else {
    next();
  }
};

const checkMovieExists = async (req, res, next) => {
  try {
    const foundMovie = await Movies.findById(req.params.movie_id).exec();
    if (!foundMovie) {
      return res.status(404).json({ message: "Not found." });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { validateMovie, checkMovieExists };
