import { usePathname } from 'next/navigation'
import useDeviceType from './use-device-type'
import useCartStore from './use-cart-store'

/**
 * Vérifie si l'utilisateur n'est pas sur certaines pages spécifiques
 * où la sidebar du panier ne doit pas s'afficher.
 * @param path - le chemin d'URL actuel
 * @returns true si la sidebar peut être affichée, false sinon
 */
const isNotInPaths = (s: string) => 
  !/^\/?$|^\/cart$|^\/checkout$|^\/sign-in$|^\/sign-up$|^\/order(\/.*)?$|^\/account(\/.*)?$|^\/admin(\/.*)?$/.test(s)

/**
 * Hook personnalisé pour déterminer si la sidebar du panier doit être affichée
 * Conditions :
 * - Il y a au moins un article dans le panier
 * - L'utilisateur est sur un appareil desktop
 * - Le chemin actuel n'est pas dans les pages exclues
 */
function useCartSidebar() {
  const {
    cart: { items },
  } = useCartStore() // Récupère les articles du panier depuis le store

  const deviceType = useDeviceType() // Détecte le type d'appareil
  const currentPath = usePathname() // Chemin actuel de la page

  // Affiche la sidebar si toutes les conditions sont réunies
  return (
    items.length > 0 &&
    deviceType === 'desktop' &&
    isNotInPaths(currentPath)
  )
}

export default useCartSidebar
