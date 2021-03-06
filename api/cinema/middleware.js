const { check, validationResult } = require("express-validator");
const Cinemas = require("./model");

const validateCinema = async (req, res, next) => {
  await check("name")
    .notEmpty()
    .withMessage("Name field can't be empty.")
    .isLength({ min: 5, max: 30 })
    .withMessage("Name must have min and max length between 5-30.")
    .run(req);

  await check("address")
    .notEmpty()
    .withMessage("Address field can't be empty.")
    .isLength({ min: 5, max: 50 })
    .withMessage("Address must have min and max length between 5-30.")
    .run(req);

  await check("zip_code")
    .notEmpty()
    .withMessage("Zip_code field can't be empty.")
    .isLength({ min: 5 })
    .withMessage("Zip_code must have min length of 5.")
    .isPostalCode("RO")
    .withMessage("Invalid zip_code")
    .run(req);

  await check("contact")
    .notEmpty()
    .withMessage("Contact field can't be empty.")
    .isLength({ min: 9 })
    .withMessage("Contact must have min length of 9.")
    .isMobilePhone()
    .withMessage("Invalid contact phone number.")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
  } else {
    next();
  }
};

const checkCinemaExists = async (req, res, next) => {
  Cinemas.findById(req.params.cinema_id)
    .exec()
    .then((cinema) => {
      if (!cinema) {
        return res.status(404).json({ message: "Not found." });
      } else {
        next();
      }
    })
    .catch(next);
};

module.exports = { validateCinema, checkCinemaExists };
