import { connectToDatabase } from "."
import data from "../data"
import { loadEnvConfig } from "@next/env"
import { cwd } from "process"
import Product from "./models/product.model"
import User from "./models/user.model"


loadEnvConfig(cwd())

const main = async () => {
     try {
          const { products, users } = data
          await connectToDatabase(process.env.MONGODB_URI)

          await User.deleteMany()
          const createUsers = await User.insertMany(users)
          console.log({
               createUsers,
               message: 'Utilisateurs enregistres avec success dans la base de donnees',
          })

          await Product.deleteMany()
          const createProducts = await Product.insertMany(products)

          console.log({
               createProducts,
               message: 'Produits enregistres avec success dans la base de donnees',
          })
          process.exit(0)
     } catch (error) {
          console.error(error)
          throw new Error('Echec d/ajout de produits dans la base de donnees')
     }
}

main()