'use client'

import { ChevronDownIcon, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes' // Hook officiel pour gérer le thème (dark/light)
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu' // Composants UI personnalisés

import useIsMounted from '@/hooks/use-is-mounted' // Hook pour vérifier que le composant est monté (évite le mismatch SSR)
import useColorStore from '@/hooks/use-colors-store' // Store custom pour gérer les couleurs dynamiques

export default function ThemeSwitcher() {
  // Récupère le thème actuel (dark, light, system) et la fonction pour changer le thème
  const { theme, setTheme } = useTheme()

  // Récupère la liste des couleurs disponibles, la couleur actuelle et la fonction pour changer la couleur
  // NOTE: Si useColorStore attend un paramètre (theme), vérifier la signature de ton hook et l'ajuster si besoin
  const { availableColors, color, setColor } = useColorStore(theme)

  // Hook pour éviter le mismatch entre SSR et client (ex: next-themes)
  const isMounted = useIsMounted()

  // Fonction pour changer le thème via next-themes
  const changeTheme = (value: string) => {
    setTheme(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-button h-[42px] flex items-center gap-2 transition-colors duration-300 hover:bg-muted hover:text-primary rounded-lg px-3">
        {/* Affichage conditionnel selon thème, uniquement après montage client */}
        {theme === 'dark' && isMounted ? (
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary" />
            <span>Dark</span>
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-400" />
            <span>Light</span>
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-xl mt-2">
        <DropdownMenuLabel className="px-3 py-1 text-muted-foreground">Theme</DropdownMenuLabel>

        {/* Groupe radio pour sélectionner le thème */}
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={changeTheme}
          className="flex flex-col"
        >
          <DropdownMenuRadioItem
            value="dark"
            className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-primary"
          >
            <Moon className="h-4 w-4" /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="light"
            className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-primary"
          >
            <Sun className="h-4 w-4" /> Light
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className="my-2 border-border" />

        <DropdownMenuLabel className="px-3 py-1 text-muted-foreground">Color</DropdownMenuLabel>

        {/* Groupe radio pour sélectionner la couleur */}
        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={(value) => setColor(value, true)} // Le second paramètre 'true' pourrait signifier sauvegarder en localStorage par ex.
          className="flex flex-col"
        >
          {availableColors.map((c) => (
            <DropdownMenuRadioItem
              key={c.name}
              value={c.name}
              className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-muted hover:text-primary"
            >
              {/* Cercle avec la couleur dynamique */}
              <div
                style={{ backgroundColor: c.name }}
                className="h-4 w-4 rounded-full border border-border"
              ></div>
              {c.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
