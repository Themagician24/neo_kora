/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "."
import data from "../data"
import { loadEnvConfig } from "@next/env"
import { cwd } from "process"
import Product from "./models/product.model"
import User from "./models/user.model"
import Review from "@/lib/db/models/review.model"
import Order from "@/lib/db/models/order.model"
import { IOrderInput, OrderItem, ShippingAddress } from "@/types"
import { calculateFutureDate, calculatePastDate, generateId, round2 } from "@/lib/utils"
import { AVALILABLE_DELIVERY_DATES } from "@/lib/constants"


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

      await Order.deleteMany()
      const orders = []
      for (let i = 0; i < 200; i++) {
        orders.push(
          await generateOrder(
            i,
            createUsers.map((x) => x._id),
            createProducts.map((x) => x._id)
          )
        )
      }
      const createdOrders = await Order.insertMany(orders)

          console.log({
               createProducts,
               createdReviews,
               createdOrders,
               createUsers,
               message: 'Produits enregistres avec success dans la base de donnees',
          })
          process.exit(0)
     } catch (error) {
          console.error(error)
          throw new Error('Echec d/ajout de produits dans la base de donnees')
     }
}

const generateOrder = async (
  i: number,
  users: any,
  products: any
): Promise<IOrderInput> => {
  const product1 = await Product.findById(products[i % products.length])

  const product2 = await Product.findById(
    products[
      i % products.length >= products.length - 1
        ? (i % products.length) - 1
        : (i % products.length) + 1
    ]
  )
  const product3 = await Product.findById(
    products[
      i % products.length >= products.length - 2
        ? (i % products.length) - 2
        : (i % products.length) + 2
    ]
  )

  if (!product1 || !product2 || !product3) throw new Error('Product not found')

  const items = [
    {
      clientId: generateId(),
      product: product1._id,
      name: product1.name,
      slug: product1.slug,
      quantity: 1,
      image: product1.images[0],
      category: product1.category,
      price: product1.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product2._id,
      name: product2.name,
      slug: product2.slug,
      quantity: 2,
      image: product2.images[0],
      category: product1.category,
      price: product2.price,
      countInStock: product1.countInStock,
    },
    {
      clientId: generateId(),
      product: product3._id,
      name: product3.name,
      slug: product3.slug,
      quantity: 3,
      image: product3.images[0],
      category: product1.category,
      price: product3.price,
      countInStock: product1.countInStock,
    },
  ]

  const order = {
    user: users[i % users.length],
    items: items.map((item) => ({
      ...item,
      product: item.product,
    })),
    shippingAddress: data.users[i % users.length].address,
    paymentMethod: data.users[i % users.length].paymentMethod,
    isPaid: true,
    isDelivered: true,
    paidAt: calculatePastDate(i),
    deliveredAt: calculatePastDate(i),
    createdAt: calculatePastDate(i),
    expectedDeliveryDate: calculateFutureDate(i % 2),
    ...calcDeliveryDateAndPriceForSeed({
      items: items,
      shippingAddress: data.users[i % users.length].address,
      deliveryDateIndex: i % 2,
    }),
  }
  return order
}

export const calcDeliveryDateAndPriceForSeed = ({
  items,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    AVALILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVALILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ]

  const shippingPrice = deliveryDate.shippingPrice

  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )
  return {
    AVALILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVALILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

main()