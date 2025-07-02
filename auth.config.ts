import type { NextAuthConfig } from 'next-auth'

// C'est simplement un objet de configuration, pas une instance complète de NextAuth
export default {
  providers: [], // Liste des providers (ex: Google, GitHub) à ajouter ici

  callbacks: {
    // Middleware pour vérifier si l'utilisateur est autorisé à accéder à certaines routes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // Définition des chemins protégés (regex)
      const protectedPaths = [
        /\/checkout(\/.*)?/, // tout ce qui commence par /checkout
        /\/account(\/.*)?/,  // tout ce qui commence par /account
        /\/admin(\/.*)?/,    // tout ce qui commence par /admin
      ]

      const { pathname } = request.nextUrl // récupère le chemin de l'URL demandée

      // Si la route correspond à un chemin protégé, vérifier qu'il y a bien une session active
      if (protectedPaths.some((p) => p.test(pathname))) return !!auth

      // Sinon accès libre
      return true
    },
  },
} satisfies NextAuthConfig
