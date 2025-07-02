import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'

export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string
  key: string
  value: string | null
}) => {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  )
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formate un nombre avec toujours 2 décimales (ex: 5 => 5.00)
export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}

// Transforme un texte en slug : minuscules, sans caractères spéciaux, espaces en tirets
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '') // Supprime tout sauf mots, espaces et tirets
    .replace(/\s+/g, '-')      // Remplace les espaces par des tirets
    .replace(/^-+|-+$/g, '')   // Supprime les tirets au début/fin
    .replace(/-+/g, '-')       // Remplace les doubles tirets

// Formate un montant en devise EUR avec 2 décimales
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'EUR',
  style: 'currency',
  minimumFractionDigits: 2,
})
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

// Formate un nombre sans symbole de devise
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

// Arrondit un nombre à 2 décimales avec précision
export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100

// Génère un identifiant aléatoire de 24 chiffres
export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')

// Formate un objet d'erreur pour extraire les messages utiles
// (Support Zod, Mongoose, et duplications MongoDB)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any): string => {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message
      return `${error.errors[field].path}: ${errorMessage}`
    })
    return fieldErrors.join('. ')
  } else if (error.name === 'ValidationError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message
      return errorMessage
    })
    return fieldErrors.join('. ')
  } else if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0]
    return `${duplicateField} already exists`
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message)
  }
}

// Calcule une date future à partir d'aujourd'hui (+days)
export function calculateFutureDate(days: number) {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + days)
  return currentDate
}

// Calcule une date passée à partir d'aujourd'hui (-days)
export function calculatePastDate(days: number) {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - days)
  return currentDate
}

// Donne le nom du mois à partir d'une chaîne "YYYY-MM"
// Ajoute "Ongoing" si le mois est en cours
export function getMonthName(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  const date = new Date(year, month - 1)
  const monthName = date.toLocaleString('default', { month: 'long' })
  const now = new Date()

  if (year === now.getFullYear() && month === now.getMonth() + 1) {
    return `${monthName} Ongoing`
  }
  return monthName
}

// Calcule le temps restant avant minuit (heures et minutes)
export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  const diff = midnight.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

// Formate une date en trois formats : complet, date seule, heure seule
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  )
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

// Tronque un ID long pour n'afficher que les 6 derniers caractères
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

// Construit dynamiquement une URL de filtre pour la recherche
export const getFilterUrl = ({
  params,
  category,
  tag,
  sort,
  price,
  rating,
  page,
}: {
  params: {
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
  tag?: string
  category?: string
  sort?: string
  price?: string
  rating?: string
  page?: string
}) => {
  const newParams = { ...params }
  if (category) newParams.category = category
  if (tag) newParams.tag = toSlug(tag)
  if (price) newParams.price = price
  if (rating) newParams.rating = rating
  if (page) newParams.page = page
  if (sort) newParams.sort = sort
  return `/search?${new URLSearchParams(newParams).toString()}`
}


// Il regroupe toutes les fonctions réutilisables pour la mise en forme (dates, nombres, erreurs, IDs…), le formatage de texte,
//  l’URL dynamique, et les opérations de base côté front.