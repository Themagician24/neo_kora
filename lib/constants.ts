// ✅ Nom de l'application (fallback par défaut si la variable n'existe pas dans .env)
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NeoKora"

// ✅ URL du serveur (utile pour fetch côté client/serveur)
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

// ✅ Email de l'expéditeur des notifications ou emails (ex: emails de confirmation)
export const SENDER_EMAIL = process.env.NEXT_PUBLIC_SENDER_EMAIL || "kinghustlerz@resend.dev"

// ✅ Nom affiché pour l'expéditeur d'emails
export const SENDER_NAME = process.env.NEXT_PUBLIC_SENDER_NAME || "NeoKora"

// ✅ Slogan de l'app (utilisé dans le SEO ou UI)
export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || "Depensez moins, vivez mieux !"

// ✅ Description de l'app (SEO ou meta description)
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "NeoKora est une application de E-Commerce pour les budgets bas qui vous aide à suivre vos dépenses et à économiser de l'argent. Avec NeoKora, vous pouvez facilement gérer vos finances et atteindre vos objectifs d'épargne."

// ✅ Copyright dynamique basé sur l'année en cours
export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © ${new Date().getFullYear()} ${APP_NAME}. Tous droits reservés.`

// ✅ Nombre de produits à afficher par page
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)

// ✅ Prix minimum pour la livraison gratuite
export const FREE_SHIPPING_MIN_PRICE = Number(process.env.FREE_SHIPPING_MIN_PRICE || 35)

// ✅ Liste des méthodes de paiement disponibles dans le tunnel de commande
export const AVAILABLE_PAYEMENT_METHODS = [
  {
    name: 'PayPal',       // Paiement via PayPal
    commission: 0,        // Aucune commission supplémentaire
    isDefault: true       // Méthode affichée en priorité
  },
  {
    name: 'Stripe',       // Paiement par carte via Stripe
    commission: 0,
    isDefault: true
  },
  {
    name: 'Cash On Delivery', // Paiement à la livraison
    commission: 0,
    isDefault: true
  },
  {
    name: 'Bank Transfer', // Virement bancaire (optionnel)
    commission: 0,
    isDefault: false
  },
  {
    name: 'Credit Card',   // Carte bancaire (autre que Stripe)
    commission: 0,
    isDefault: true
  },
]

// ✅ Méthode de paiement par défaut utilisée si l'utilisateur n'en sélectionne pas
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

// ✅ Liste des options de livraison disponibles (utilisées dans le checkout)
export const AVALILABLE_DELIVERY_DATES = [
  {
    name: 'Tomorrow',              // Livraison le lendemain
    daysToDeliver: 1,              // Délai estimé
    shippingPrice: 12.9,           // Frais de port
    freeShippingMinPrice: 0        // Pas de seuil pour livraison gratuite
  },
  {
    name: 'Next 3 Days',           // Livraison sous 3 jours
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0
  },
  {
    name: 'Next 5 Days',           // Livraison économique
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35       // Livraison gratuite à partir de 35€
  },
]
