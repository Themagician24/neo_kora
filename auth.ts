import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from './lib/db'
import client from './lib/db/client'
import User from './lib/db/models/user.model'

import NextAuth, { type DefaultSession } from 'next-auth'
import authConfig from './auth.config'


declare module 'next-auth' {
     interface Session {
       user: {
         role: string // On ajoute le rôle de l'utilisateur dans la session (admin, user, etc.)
       } & DefaultSession['user'] // On garde toutes les infos par défaut (email, image, name, etc.)
     }
   }
   
   export const { handlers, auth, signIn, signOut } = NextAuth({
     // On importe une configuration personnalisée définie ailleurs
     ...authConfig,
   
     // Définition des pages personnalisées utilisées par NextAuth
     pages: {
       signIn: '/sign-in',   // Page de connexion personnalisée
       newUser: '/sign-up',  // Page de redirection après une première connexion
       error: '/sign-in',    // Redirection en cas d’erreur
     },
   
     // Configuration de la session utilisateur
     session: {
       strategy: 'jwt',                  // Utilise JSON Web Token pour la gestion de session
       maxAge: 30 * 24 * 60 * 60,        // Durée de vie de la session : 30 jours
     },
   
     // Adaptateur pour connecter NextAuth à la base MongoDB
     adapter: MongoDBAdapter(client),
   
     // Liste des fournisseurs d’authentification
     providers: [
       // Connexion via Google OAuth
       Google({
         allowDangerousEmailAccountLinking: true, // Permet d’associer plusieurs comptes ayant le même email
       }),
   
       // Connexion via email + mot de passe
       CredentialsProvider({
         // Champs requis pour l’authentification manuelle
         credentials: {
           email: {
             type: 'email', // Champ email
           },
           password: { type: 'password' }, // Champ mot de passe
         },
   
         // Fonction qui valide les identifiants saisis par l'utilisateur
         async authorize(credentials) {
           await connectToDatabase() // Connexion à la base MongoDB
   
           if (credentials == null) return null // Si aucun identifiant fourni
   
           // Recherche d’un utilisateur avec l’email fourni
           const user = await User.findOne({ email: credentials.email })
   
           // Si un utilisateur est trouvé et qu’il a un mot de passe
           if (user && user.password) {
             // Vérifie que le mot de passe correspond à celui en base (haché)
             const isMatch = await bcrypt.compare(
               credentials.password as string,
               user.password
             )
   
             if (isMatch) {
               // Retourne les infos nécessaires pour générer le token JWT
               return {
                 id: user._id,
                 name: user.name,
                 email: user.email,
                 role: user.role,
               }
             }
           }
   
           // Sinon, échec de l’authentification
           return null
         },
       }),
     ],
   
     // Callbacks pour personnaliser les tokens et les sessions
     callbacks: {
       // Callback déclenché à chaque création ou mise à jour de JWT
       jwt: async ({ token, user, trigger, session }) => {
         if (user) {
           // Si l’utilisateur n’a pas de nom défini, on le met à jour dans la base
           if (!user.name) {
             await connectToDatabase()
             await User.findByIdAndUpdate(user.id, {
               name: user.name || user.email!.split('@')[0],
               role: 'user', // On lui assigne un rôle par défaut
             })
           }
   
           // Ajout du nom et du rôle dans le token JWT
           token.name = user.name || user.email!.split('@')[0]
           token.role = (user as { role: string }).role
         }
   
         // Si la session est mise à jour manuellement, on met à jour le nom
         if (session?.user?.name && trigger === 'update') {
           token.name = session.user.name
         }
   
         return token // Retourne le token modifié
       },
   
       // Callback pour enrichir la session utilisateur côté client
       session: async ({ session, user, trigger, token }) => {
         session.user.id = token.sub as string      // On ajoute l’ID dans la session
         session.user.role = token.role as string   // On ajoute le rôle dans la session
         session.user.name = token.name             // On met à jour le nom de l’utilisateur
   
         // Mise à jour du nom côté session si nécessaire
         if (trigger === 'update') {
           session.user.name = user.name
         }
   
         return session // Retourne la session complète
       },
     },
   })


//    Gère l'authentification avec Google ou mot de passe.

// Stocke les sessions dans des JWT avec id, name, role.

// Met à jour le nom de l’utilisateur si manquant.

// Gère les redirections vers des pages personnalisées.
   