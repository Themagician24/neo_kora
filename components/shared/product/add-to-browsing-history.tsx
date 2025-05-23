/**
 * Un composant React qui ajoute un produit à l'historique de navigation lorsqu'il est rendu.
 * Ce composant utilise le hook `useBrowsingHistory` pour gérer l'historique de navigation.
 *
 * @composant
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.id - L'identifiant unique du produit à ajouter à l'historique de navigation.
 * @param {string} props.category - La catégorie du produit à ajouter à l'historique de navigation.
 *
 * @exemple
 * <AddToBrowsingHistory id="12345" category="electronics" />
 *
 * @remarques
 * Ce composant est conçu pour être utilisé dans un environnement client (`'use client'` directive).
 * Il utilise le hook `useEffect` pour ajouter le produit à l'historique de navigation lorsque le composant est monté.
 * La fonction `addItem` du hook `useBrowsingHistory` est appelée avec les détails du produit.
 */
'use client'

import useBrowsingHistory from '@/hooks/use-browsing'
import { useEffect } from 'react'

export default function AddToBrowsingHistory({
  id,
  category,
}: {
  id: string
  category: string
}) {
  const { addItem } = useBrowsingHistory()
  useEffect(() => {
    addItem({ id, category })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
