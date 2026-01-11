import { AppError } from "../shared/errors/AppError.js";
import { createContactMessage } from "../services/contact.service.js";

export async function postContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return next(new AppError("Tous les champs sont requis", 400, { code: "BAD_REQUEST" }));
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Email invalide", 400, { code: "BAD_REQUEST" }));
    }

    // Sauvegarder le message dans la base de données
    const contactMessage = await createContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      id: contactMessage._id,
    });
  } catch (e) {
    if (e.message === "MongoDB not connected") {
      return next(new AppError("Service temporairement indisponible. Veuillez réessayer plus tard.", 503, { code: "SERVICE_UNAVAILABLE" }));
    }
    next(new AppError(e.message || "Erreur lors de l'envoi du message", 500, { code: "INTERNAL_ERROR" }));
  }
}
