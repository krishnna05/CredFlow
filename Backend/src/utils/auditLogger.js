const AuditLog = require("./models/AuditLog");

exports.logEvent = async ({
  userId,
  action,
  entityType,
  entityId,
  message,
}) => {
  await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    message,
  });
};
