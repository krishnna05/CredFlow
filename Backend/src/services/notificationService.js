const Notification = require("../models/Notification");

exports.sendNotification = async ({
  userId,
  title,
  message,
}) => {
  await Notification.create({
    userId,
    title,
    message,
  });
};
