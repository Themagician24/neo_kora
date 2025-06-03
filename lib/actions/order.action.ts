import { OrderItem, ShippingAddress } from "@/types"
import { round2 } from "../utils"
import { AVALILABLE_DELIVERY_DATES } from "../constants"

export const calcDeliveryDateAndPrice = async ({
     items,
     shippingAddress,
     deliveryDateIndex,
     
} : {
     deliveryDateIndex?: number
     shippingAddress?: ShippingAddress
     items: OrderItem[]
}) => {
     const itemsPrice = round2(
          items.reduce((acc, item) => acc + item.price * item.quantity, 0)
     )



     const  deliveryDate = AVALILABLE_DELIVERY_DATES[
          deliveryDateIndex === undefined
           ? AVALILABLE_DELIVERY_DATES.length - 1
               : deliveryDateIndex
     ]

     const shippingPrice = 
     !shippingAddress || !deliveryDate 
     ? undefined
        :deliveryDate.freeShippingMinPrice > 0 && 
        itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice


     const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15)

     
     
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
         totalPrice
     }
}

