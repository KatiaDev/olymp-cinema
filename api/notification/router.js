const router = require("express").Router();
const Notifications = require("./model");
const {
  checkNotificationExists,
  validateNewNotification,
} = require("./middleware");
const nodemailer = require("nodemailer");
const {
  registeredAcces,
  staffAcces,
  validateUserIdentity,
} = require("../auth/middleware");
const { checkUserExists } = require("../user/middleware");

router.get("/", registeredAcces, staffAcces, async (req, res, next) => {
  Notifications.find()
    .exec()
    .then((notification) => {
      res.status(200).json(notification);
    })
    .catch(next);
});

router.get(
  "/:notification_id",
  checkNotificationExists,
  registeredAcces,
  staffAcces,
  async (req, res, next) => {
    Notifications.findById(req.params.notification_id)
      .exec()
      .then((notification) => {
        res.status(200).json(notification);
      })
      .catch(next);
  }
);

router.get(
  "/:user_id/notifications",
  checkUserExists,
  registeredAcces,
  validateUserIdentity,
  async (req, res, next) => {
    const { users } = req.body;

    // const user = users.map((el) => {
    //   return el._id === req.params.user_id;
    // });

    

    Notifications.findOne({ _id: req.params.notification_id})
      .exec()
      .then((notification) => {
        res.status(200).json(notification);
      })
      .catch(next);
  }
);

router.post(
  "/",
  validateNewNotification,
  registeredAcces,
  staffAcces,
  async (req, res, next) => {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_PROFILE,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const msg = {
      from: `"Olymp Cinema" <${process.env.EMAIL_PROFILE}>`,
      to: "marin.cebotari94@gmail.com",
      subject: "TestMesage",
      text: "Welcome to Olymp Cinema ",
    };

    const info = await transporter.sendMail(msg);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    new Notifications(req.body)
      .save()
      .then((newNotification) => {
        res.status(200).json(newNotification);
      })
      .catch(next);
  }
);

router.put(
  "/:notification_id",
  checkNotificationExists,
  validateNewNotification,
  registeredAcces,
  staffAcces,
  async (req, res, next) => {
    const bodyReducer = Object.keys(req.body).reduce((acc, curr) => {
      acc[curr] = req.body[curr];
      return acc;
    }, {});

    Notifications.findByIdAndUpdate(req.params.notification_id, bodyReducer)
      .exec()
      .then((updatedNoitification) => {
        res.status(200).json(updatedNoitification);
      })
      .catch(next);
  }
);

router.delete(
  "/:notification_id",
  checkNotificationExists,
  registeredAcces,
  staffAcces,
  async (req, res, next) => {
    Notifications.findByIdAndDelete(req.params.notification_id)
      .exec()
      .then((deletedNotification) => {
        res.status(200).json(deletedNotification);
      })
      .catch(next);
  }
);

router.delete(
  "/:user_id/:notification_id",
  checkNotificationExists,
  registeredAcces,
  validateUserIdentity,
  async (req, res, next) => {
    Notifications.findByIdAndDelete(req.params.notification_id)
      .exec()
      .then((deletedNotification) => {
        res.status(200).json(deletedNotification);
      })
      .catch(next);
  }
);

module.exports = router;
