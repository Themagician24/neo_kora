'use server'

// Imports nécessaires
import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { connectToDatabase } from '../db'
import Product from '../db/models/product.model'
import Review, { IReview } from '../db/models/review.model'
import { formatError } from '../utils'
import { ReviewInputSchema } from '../validator'
import { IReviewDetails, IReviewInput } from '@/types'

/**
 * Crée ou met à jour une review pour un produit donné.
 * Si l'utilisateur a déjà laissé un avis, on le met à jour, sinon on en crée un nouveau.
 * @param data - Données du formulaire de review
 * @param path - Chemin à revalider côté cache Next.js
 */
export async function createUpdateReview({
  data,
  path,
}: {
  data: IReviewInput
  path: string
}) {
  try {
    // Vérifie que l'utilisateur est bien authentifié
    const session = await auth()
    if (!session) {
      throw new Error('User is not authenticated')
    }

    // Valide les données avec Zod pour garantir qu'elles sont bien formées
    const review = ReviewInputSchema.parse({
      ...data,
      user: session?.user?.id,
    })

    await connectToDatabase()

    // Vérifie si l'utilisateur a déjà laissé une review pour ce produit
    const existReview = await Review.findOne({
      product: review.product,
      user: review.user,
    })

    if (existReview) {
      // Met à jour l'existant
      existReview.comment = review.comment
      existReview.rating = review.rating
      existReview.title = review.title
      await existReview.save()

      await updateProductReview(review.product)
      revalidatePath(path)

      return {
        success: true,
        message: 'Review updated successfully',
      }
    } else {
      // Crée une nouvelle review
      await Review.create(review)
      await updateProductReview(review.product)
      revalidatePath(path)

      return {
        success: true,
        message: 'Review created successfully',
      }
    }
  } catch (error) {
    // Formate proprement l'erreur à retourner au frontend
    return {
      success: false,
      message: formatError(error),
    }
  }
}

/**
 * Recalcule la note moyenne, le nombre total de reviews,
 * et la distribution des ratings pour le produit donné.
 */
const updateProductReview = async (productId: string) => {
  // Agrège les reviews par rating
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$rating', // regroupe par rating (1 à 5)
        count: { $sum: 1 }, // compte combien
      },
    },
  ])

  // Calcul du total des reviews
  const totalReviews = result.reduce((sum, { count }) => sum + count, 0)

  // Calcul de la note moyenne (ex: (5*10 + 4*3 + ...)/ total)
  const avgRating =
    result.reduce((sum, { _id, count }) => sum + _id * count, 0) / totalReviews

  // Transforme en map pour faciliter le lookup
  const ratingMap = result.reduce((map, { _id, count }) => {
    map[_id] = count
    return map
  }, {} as Record<number, number>)

  // Crée un tableau pour représenter 1 à 5 même si aucun rating
  const ratingDistribution = []
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.push({ rating: i, count: ratingMap[i] || 0 })
  }

  // Met à jour le produit avec les nouvelles stats
  await Product.findByIdAndUpdate(productId, {
    avgRating: avgRating.toFixed(1),
    numReviews: totalReviews,
    ratingDistribution,
  })
}

/**
 * Récupère les reviews paginées pour un produit donné
 * @param productId - ID du produit
 * @param limit - nombre de reviews par page (défaut 10)
 * @param page - numéro de page (1-based)
 */
export async function getReviews({
  productId,
  limit,
  page,
}: {
  productId: string
  limit?: number
  page: number
}) {
  limit = limit || 10
  await connectToDatabase()

  // Calcul du skip pour la pagination
  const skipAmount = (page - 1) * limit

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name') // pour afficher le nom
    .sort({ createdAt: 'desc' }) // les plus récentes d'abord
    .skip(skipAmount)
    .limit(limit)

  const reviewsCount = await Review.countDocuments({ product: productId })

  return {
    data: JSON.parse(JSON.stringify(reviews)) as IReviewDetails[],
    totalPages: reviewsCount === 0 ? 1 : Math.ceil(reviewsCount / limit),
  }
}

/**
 * Récupère la review actuelle d'un utilisateur connecté pour un produit donné
 * @param productId - ID du produit
 */
export const getReviewByProductId = async ({
  productId,
}: {
  productId: string
}) => {
  await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }

  const review = await Review.findOne({
    product: productId,
    user: session?.user?.id,
  })

  return review ? (JSON.parse(JSON.stringify(review)) as IReview) : null
}
