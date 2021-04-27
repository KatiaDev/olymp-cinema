const { check, validationResult } = require("express-validator");
const Tickets = require("./model");

const validateNewTicket = async (req, res, next) => {
  await check("qrcode")
    .trim()
    .notEmpty()
    .withMessage(" QR - Code is required")
    .isLength({ min: 10 })
    .withMessage(" QR - Code is corrupt")
    .run(req);

  await check("pay_type")
    .trim()
    .notEmpty()
    .withMessage(" Pay type is required ")
    .isLength({ min: 3 })
    .isIn(["cash", "card", "bitcoin"])
    .withMessage(" Undefined pay type")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
  }

  next();
};

const checkTicketExists = async (req, res, next) => {
  await check("ticket_id")
    .custom((ticket) => {
      return Tickets.findById(ticket)
        .then((ticket) => {
          if (!ticket) {
            return res.status(404).json(" Ticket is not found ");
          }
        })
        .catch(next);
    })
    .run(req);
  next();
};

module.exports = {
  validateNewTicket,
  checkTicketExists,
};