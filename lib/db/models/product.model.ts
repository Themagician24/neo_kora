import { IproductInput } from "@/types"
import { Document, model, models, Schema, Model } from "mongoose"

// L’interface du document MongoDB pour le produit
export interface Iproduct extends Document, IproductInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// Le schéma Mongoose du produit
const productSchema = new Schema<Iproduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: [String],
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    listPrice: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      default: ['new arrivals'],
    },
    colors: {
      type: [String],
      default: ['white', 'black',
         'blue', 'red', 'green', 'yellow', 'gray, orange, purple'],
    },
    sizes: {
      type: [String],
      default: ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'],
    },
    avgRating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    ratingDistribution: [
      {
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
    numSales: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Product =
  (models.Product as Model<Iproduct>) ||
  model<Iproduct>('Product', productSchema)

export default Product