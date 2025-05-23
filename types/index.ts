import { CartSchema, OrderItemSchema, ProductInputSchema } from "@/lib/validator";
import { z } from "zod";

export type IproductInput = z.infer<typeof ProductInputSchema>
export type Data = {
     products: IproductInput[]
     headerMenus : {
          name: string
          href: string
     }[]
    carousels: {
     image: string
     url: string
     title: string
     buttonCaption: string
     isPublished: boolean
    } []


}

export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>