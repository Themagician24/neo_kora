import { IUserInput } from "@/types";
import { Document, Model, model, models, Schema } from "mongoose";

// Interface qui représente un utilisateur complet dans la base de données
// Elle hérite à la fois du type de Mongoose (Document) et des champs définis dans IUserInput
export interface IUser extends Document, IUserInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Définition du schéma de l'utilisateur pour Mongoose
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },

    name: { type: String, required: true },

    role: { type: String, required: true, default: "User" },

    password: { type: String },

    image: { type: String },

    emailVerified: { type: Boolean, default: false }
  },
  {
    // Active la gestion automatique des dates createdAt et updatedAt
    timestamps: true
  }
);

// Création du modèle Mongoose 'User'
// Vérifie si un modèle "User" existe déjà (pour éviter les erreurs en dev avec hot-reload)
// Sinon, crée un nouveau modèle à partir du schéma
const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

// Export du modèle pour pouvoir l'utiliser dans toute l'application
export default User;
