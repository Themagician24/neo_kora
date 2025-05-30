import { z } from 'zod'
import { formatNumberWithDecimal } from './utils'

// ---------- SCHEMAS COMMUNS ----------

// Définition d'un identifiant MongoDB valide (24 caractères hexadécimaux)
const MongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ID' })

// Fonction utilitaire pour créer un champ prix qui doit contenir exactement deux décimales
const Price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      `${field} must have exactly two decimal places (e.g., 49.99)`
    )

// ---------- REVUE ----------

// Schéma pour une évaluation d'un produit
export const ReviewInputSchema = z.object({
  product: MongoId,
  user: MongoId,
  isVerifiedPurchase: z.boolean(), // achat vérifié
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(1, 'Comment is required'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
})

// ---------- PRODUIT ----------

// Schéma pour la création d’un produit
export const ProductInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().min(1, 'Description is required'),
  isPublished: z.boolean(),
  price: Price('Price'),
  listPrice: Price('List price'),
  countInStock: z.coerce.number().int().nonnegative('count in stock must be a non-negative number'),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  avgRating: z.coerce.number().min(0).max(5),
  numReviews: z.coerce.number().int().nonnegative(),
  ratingDistribution: z.array(z.object({ rating: z.number(), count: z.number() })).max(5),
  reviews: z.array(ReviewInputSchema).default([]),
  numSales: z.coerce.number().int().nonnegative(),
})

// Schéma pour la mise à jour d’un produit (ajoute juste un _id au schéma d’input)
export const ProductUpdateSchema = ProductInputSchema.extend({
  _id: z.string(),
})

// ---------- ÉLÉMENT DE COMMANDE ----------

// Élément individuel d'une commande (ligne panier)
export const OrderItemSchema = z.object({
  clientId: z.string().min(1, 'clientId is required'),
  product: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().int().nonnegative('Quantity must be a non-negative number'),
  countInStock: z.number().int().nonnegative('Quantity must be a non-negative number'),
  image: z.string().min(1, 'Image is required'),
  price: Price('Price'),
  size: z.string().optional(),
  color: z.string().optional(),
})

// ---------- ADRESSE D’EXPÉDITION ----------

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  street: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  province: z.string().min(1, 'Province is required'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
})

// ---------- COMMANDE ----------

// Schéma complet d’une commande passée
export const OrderInputSchema = z.object({
  user: z.union([
    MongoId,
    z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  ]),
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least one item'),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),
  itemsPrice: Price('Items price'),
  shippingPrice: Price('Shipping price'),
  taxPrice: Price('Tax price'),
  totalPrice: Price('Total price'),
  expectedDeliveryDate: z.date().refine(
    (value) => value > new Date(),
    'Expected delivery date must be in the future'
  ),
  isDelivered: z.boolean().default(false),
  deliveredAt: z.date().optional(),
  isPaid: z.boolean().default(false),
  paidAt: z.date().optional(),
})

// ---------- PANIER ----------

// Schéma pour le panier actuel de l'utilisateur
export const CartSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least one item'),
  itemsPrice: z.number(),
  taxPrice: z.optional(z.number()),
  shippingPrice: z.optional(z.number()),
  totalPrice: z.number(),
  paymentMethod: z.optional(z.string()),
  shippingAddress: z.optional(ShippingAddressSchema),
  deliveryDateIndex: z.optional(z.number()),
  expectedDeliveryDate: z.optional(z.date()),
})

// ---------- UTILISATEUR ----------

// Champs individuels communs
const UserName = z.string().min(2).max(50)
const Email = z.string().min(1).email()
const Password = z.string().min(3)
const UserRole = z.string().min(1, 'role is required')

// Schéma pour mise à jour de profil utilisateur
export const UserUpdateSchema = z.object({
  _id: MongoId,
  name: UserName,
  email: Email,
  role: UserRole,
})

// Schéma de création d’un nouvel utilisateur
export const UserInputSchema = z.object({
  name: UserName,
  email: Email,
  image: z.string().optional(),
  emailVerified: z.boolean(),
  role: UserRole,
  password: Password,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  address: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Phone number is required'),
  }),
})

// Authentification : connexion
export const UserSignInSchema = z.object({
  email: Email,
  password: Password,
})

// Authentification : inscription
export const UserSignUpSchema = UserSignInSchema.extend({
  name: UserName,
  confirmPassword: Password,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Modification nom utilisateur uniquement
export const UserNameSchema = z.object({
  name: UserName,
})

// ---------- PAGE WEB ----------

// Schéma d'une page CMS
export const WebPageInputSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(1, 'Content is required'),
  isPublished: z.boolean(),
})

// Page CMS avec ID
export const WebPageUpdateSchema = WebPageInputSchema.extend({
  _id: z.string(),
})

// ---------- PARAMÈTRES DU SITE ----------

// Langue supportée par le site
export const SiteLanguageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
})

// Élément de carrousel (slider d’accueil)
export const CarouselSchema = z.object({
  title: z.string().min(1, 'title is required'),
  url: z.string().min(1, 'url is required'),
  image: z.string().min(1, 'image is required'),
  buttonCaption: z.string().min(1, 'buttonCaption is required'),
})

// Devise supportée par le site
export const SiteCurrencySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  convertRate: z.coerce.number().min(0),
  symbol: z.string().min(1, 'Symbol is required'),
})

// Méthode de paiement supportée
export const PaymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  commission: z.coerce.number().min(0),
})

// Mode de livraison
export const DeliveryDateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  daysToDeliver: z.number().min(0),
  shippingPrice: z.coerce.number().min(0),
  freeShippingMinPrice: z.coerce.number().min(0),
})

// Schéma complet des paramètres du site
export const SettingInputSchema = z.object({
  common: z.object({
    pageSize: z.coerce.number().min(1).default(9),
    isMaintenanceMode: z.boolean().default(false),
    freeShippingMinPrice: z.coerce.number().min(0).default(0),
    defaultTheme: z.string().min(1).default('light'),
    defaultColor: z.string().min(1).default('gold'),
  }),
  site: z.object({
    name: z.string().min(1),
    logo: z.string().min(1),
    slogan: z.string().min(1),
    description: z.string().min(1),
    keywords: z.string().min(1),
    url: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    author: z.string().min(1),
    copyright: z.string().min(1),
    address: z.string().min(1),
  }),
  availableLanguages: z.array(SiteLanguageSchema).min(1),
  carousels: z.array(CarouselSchema).min(1),
  defaultLanguage: z.string().min(1),
  availableCurrencies: z.array(SiteCurrencySchema).min(1),
  defaultCurrency: z.string().min(1),
  availablePaymentMethods: z.array(PaymentMethodSchema).min(1),
  defaultPaymentMethod: z.string().min(1),
  availableDeliveryDates: z.array(DeliveryDateSchema).min(1),
  defaultDeliveryDate: z.string().min(1),
})
