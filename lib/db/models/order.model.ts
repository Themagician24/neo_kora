import { IOrderInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

// Interface pour un document de commande MongoDB
export interface IOrder extends Document, IOrderInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// Schéma Mongoose pour une commande
const orderSchema = new Schema<IOrder>(
  {
    // Référence à l'utilisateur ayant passé la commande
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
      required: true,
    },

    // Liste des produits commandés
    items: [
      {
        product: {
          type: Schema.Types.ObjectId, // Référence au produit
          ref: 'Product',
          required: true,
        },
        clientId: { type: String, required: true }, // ID interne du produit dans le panier
        name: { type: String, required: true },     // Nom du produit
        slug: { type: String, required: true },     // Slug pour les URLs
        image: { type: String, required: true },    // Image du produit
        category: { type: String, required: true }, // Catégorie du produit
        price: { type: Number, required: true },    // Prix unitaire
        countInStock: { type: Number, required: true }, // Stock disponible
        quantity: { type: Number, required: true }, // Quantité commandée
        size: { type: String },                     // Taille (optionnelle)
        color: { type: String },                    // Couleur (optionnelle)
      },
    ],

    // Adresse de livraison
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      province: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // Date estimée de livraison
    expectedDeliveryDate: { type: Date, required: true },

    // Méthode de paiement utilisée (ex: PayPal, Stripe, etc.)
    paymentMethod: { type: String, required: true },

    // Résultat du paiement (pour les paiements en ligne)
    paymentResult: { id: String, status: String, email_address: String },

    // Prix total des articles
    itemsPrice: { type: Number, required: true },

    // Frais de livraison
    shippingPrice: { type: Number, required: true },

    // Taxes appliquées
    taxPrice: { type: Number, required: true },

    // Prix total de la commande
    totalPrice: { type: Number, required: true },

    // Indique si la commande est payée
    isPaid: { type: Boolean, required: true, default: false },

    // Date à laquelle la commande a été payée
    paidAt: { type: Date },

    // Indique si la commande a été livrée
    isDelivered: { type: Boolean, required: true, default: false },

    // Date de livraison effective
    deliveredAt: { type: Date },

    // Date de création de la commande (défaut = maintenant)
    createdAt: { type: Date, default: Date.now },
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
)

// Création du modèle Order s’il n'existe pas déjà
const Order =
  (models.Order as Model<IOrder>) || model<IOrder>('Order', orderSchema)

export default Order
