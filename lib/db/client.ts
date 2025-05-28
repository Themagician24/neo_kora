
import { MongoClient, ServerApiVersion } from 'mongodb'



// Vérifie que la variable d'environnement MONGODB_URI est bien définie
if (!process.env.MONGODB_URI) {
  throw new Error('Variable d’environnement invalide/manquante : "MONGODB_URI"')
}

// Récupère l'URI de connexion à MongoDB
const uri = process.env.MONGODB_URI

// Options de configuration pour le client MongoDB
const options = {
  serverApi: {
    version: ServerApiVersion.v1,   // Utilise l'API MongoDB version 1
    strict: true,                   // Active le mode strict pour éviter les erreurs silencieuses
    deprecationErrors: true,        // Active les erreurs sur les fonctions obsolètes
  },
}

let client: MongoClient // Déclaration du client MongoDB

// Comportement différent selon l’environnement
if (process.env.NODE_ENV === 'development') {
  // En développement, on stocke le client dans une variable globale
  // pour éviter de créer plusieurs instances lors des rechargements (HMR)
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }

  // Si aucune instance n'existe encore, on en crée une
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options)
  }

  // Réutilisation de l'instance existante
  client = globalWithMongo._mongoClient
} else {
  // En production, on crée une nouvelle instance du client Mongo à chaque fois
  client = new MongoClient(uri, options)
}

// On exporte le client Mongo pour le partager dans toute l'application
export default client
