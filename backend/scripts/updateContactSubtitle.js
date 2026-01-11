import mongoose from "mongoose";
import { SiteContentModel } from "../db/models/SiteContent.js";
import { connectMongo } from "../db/connectMongo.js";

async function updateContactSubtitle() {
  try {
    await connectMongo();
    console.log("Connexion à MongoDB réussie");

    const doc = await SiteContentModel.findOne({ key: "main" });
    if (!doc) {
      console.log("Aucun document SiteContent trouvé. Création d'un nouveau document...");
      return;
    }

    if (doc.content?.contact?.subtitle) {
      const oldSubtitle = doc.content.contact.subtitle;
      doc.content.contact.subtitle = "Presse, candidatures, coordination, partenariats: écrivez-nous via le formulaire ci-dessous.";
      
      await doc.save();
      console.log("Sous-titre mis à jour avec succès !");
      console.log("Ancien texte:", oldSubtitle);
      console.log("Nouveau texte:", doc.content.contact.subtitle);
    } else {
      console.log("La structure contact.subtitle n'existe pas dans le document");
    }

    process.exit(0);
  } catch (error) {
    console.error("Erreur:", error);
    process.exit(1);
  }
}

updateContactSubtitle();
