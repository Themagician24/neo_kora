import { useState, useEffect } from 'react'

// Hook personnalisé pour détecter le type d'appareil : 'mobile' ou 'desktop'
function useDeviceType() {


  // On initialise le type d'appareil à 'unknown' par défaut
  const [deviceType, setDeviceType] = useState('unknown')

  useEffect(() => {

     
    // Fonction pour déterminer le type de device selon la largeur de l'écran
    const handleResize = () => {
      setDeviceType(window.innerWidth <= 768 ? 'mobile' : 'desktop')
    }

    handleResize() // Détection immédiate au premier rendu

    // On écoute les changements de taille de l'écran
    window.addEventListener('resize', handleResize)

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // On retourne le type de device détecté
  return deviceType
}

export default useDeviceType
