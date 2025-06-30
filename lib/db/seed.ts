import { connectToDatabase } from "."
import data from "../data"
import { loadEnvConfig } from "@next/env"
import { cwd } from "process"
import Product from "./models/product.model"
import User from "./models/user.model"
import Review from "@/lib/db/models/review.model"


loadEnvConfig(cwd())

const main = async () => {
     try {
          const { products, users, reviews } = data
          await connectToDatabase(process.env.MONGODB_URI)

          await User.deleteMany()
          const createUsers = await User.insertMany(users)
          console.log({
               createUsers,
               message: 'Utilisateurs enregistres avec success dans la base de donnees',
          })

          await Product.deleteMany()
          const createProducts = await Product.insertMany(products)


          
    await Review.deleteMany()
    const rws = []
    for (let i = 0; i < createProducts.length; i++) {
      let x = 0
      const { ratingDistribution } = createProducts[i]
      for (let j = 0; j < ratingDistribution.length; j++) {
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++
          rws.push({
            ...reviews.filter((x) => x.rating === j + 1)[
              x % reviews.filter((x) => x.rating === j + 1).length
            ],
            isVerifiedPurchase: true,
            product: createProducts[i]._id,
            user: createUsers[x % createUsers.length]._id,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          })
        }
      }
    }

    const createdReviews = await Review.insertMany(rws)

          console.log({
               createProducts,
               createdReviews,
               createUsers,
               message: 'Produits enregistres avec success dans la base de donnees',
          })
          process.exit(0)
     } catch (error) {
          console.error(error)
          throw new Error('Echec d/ajout de produits dans la base de donnees')
     }
}

main()