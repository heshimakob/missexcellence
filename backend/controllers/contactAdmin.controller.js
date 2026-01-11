import { AppError } from "../shared/errors/AppError.js";
import { listContactMessages, markAsRead, deleteContactMessage } from "../services/contact.service.js";

export async function getContactMessages(_req, res, next) {
  try {
    const messages = await listContactMessages();
    res.json({ messages });
  } catch (e) {
    if (e.message === "MongoDB not connected") {
      return next(new AppError("MongoDB not connected", 503, { code: "SERVICE_UNAVAILABLE" }));
    }
    next(new AppError(e.message || "Cannot fetch messages", 500, { code: "INTERNAL_ERROR" }));
  }
}

export async function patchContactMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { read } = req.body;

    if (read === true) {
      const message = await markAsRead(id);
      if (!message) return next(new AppError("Message not found", 404, { code: "NOT_FOUND" }));
      return res.json({ message });
    }

    return next(new AppError("Invalid action", 400, { code: "BAD_REQUEST" }));
  } catch (e) {
    if (e.message === "MongoDB not connected") {
      return next(new AppError("MongoDB not connected", 503, { code: "SERVICE_UNAVAILABLE" }));
    }
    next(new AppError(e.message || "Cannot update message", 500, { code: "INTERNAL_ERROR" }));
  }
}

export async function deleteContactMessageHandler(req, res, next) {
  try {
    const { id } = req.params;
    const message = await deleteContactMessage(id);
    if (!message) return next(new AppError("Message not found", 404, { code: "NOT_FOUND" }));
    res.status(204).send();
  } catch (e) {
    if (e.message === "MongoDB not connected") {
      return next(new AppError("MongoDB not connected", 503, { code: "SERVICE_UNAVAILABLE" }));
    }
    next(new AppError(e.message || "Cannot delete message", 500, { code: "INTERNAL_ERROR" }));
  }
}
