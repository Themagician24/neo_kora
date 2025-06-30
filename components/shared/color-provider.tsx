'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import useColorStore from '@/hooks/use-colors-store'

export function ColorProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Récupérer le thème courant (ex: 'light', 'dark')
  const { theme } = useTheme()

  // Hook personnalisé qui gère la couleur en fonction du thème
  const { color, updateCssVariables } = useColorStore()

  // Met à jour les variables CSS quand le thème ou la couleur change
  React.useEffect(() => {
    updateCssVariables()
  }, [theme, color, updateCssVariables])

  // Passer props de config du ThemeProvider (ex: defaultTheme)
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
