
import { CartSchema, OrderInputSchema, OrderItemSchema, ProductInputSchema, ReviewInputSchema, ShippingAddressSchema, UserInputSchema, UserNameSchema, UserSignInSchema, UserSignUpSchema } from "@/lib/validator";
import { z } from "zod";

export type IReviewInput = z.infer<typeof ReviewInputSchema>

export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}


// Définition du type TypeScript à partir du schéma de validation d'un produit
export type IProductInput = z.infer<typeof ProductInputSchema>

// Structure de données globale utilisée probablement pour de l'affichage côté client (ex: page d'accueil, produits, carrousel, etc.)
export type Data = {
  
  // Liste des utilisateurs à afficher
  users: IUserInput[]

  // Liste des produits à afficher
  products: IProductInput[]

  // Liste des avis clients associés aux produits
  reviews: {
    title: string     // Titre de l’avis
    rating: number    // Note sur 5
    comment: string   // Commentaire du client
  }[]

  // Liens de navigation dans l'en-tête (menu)
  headerMenus: {
    name: string      // Nom du lien (ex: "Shop", "Contact")
    href: string      // URL vers laquelle pointe le lien
  }[]

  // Carrousels d’images (ex: bannières promotionnelles)
  carousels: {
    image: string           // URL de l’image affichée
    url: string             // Lien cliquable associé à l’image
    title: string           // Titre du carrousel (ex: "Promo du jour")
    buttonCaption: string   // Texte du bouton (ex: "Acheter maintenant")
    isPublished: boolean    // Indique si le carrousel est actif/publié
  }[]
}


export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}


// Type représentant un article de commande, basé sur le schéma Zod correspondant
export type OrderItem = z.infer<typeof OrderItemSchema>

// Type représentant un panier d'achat complet (liste d’articles + quantités)
export type Cart = z.infer<typeof CartSchema>

// Type représentant une adresse de livraison
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>


//USERS
export type IOrderInput = z.infer<typeof OrderInputSchema>
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUSignUp = z.infer<typeof UserSignUpSchema>
export type ShippingAdress = z.infer<typeof ShippingAddressSchema>
export type IUserName = z.infer<typeof UserNameSchema>
