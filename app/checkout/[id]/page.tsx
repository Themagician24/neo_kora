import { auth } from "@/auth"
import { getOrderById } from "@/lib/actions/order.action"
import { notFound } from "next/navigation"
import PaymentForm from "./payment-form"
import Stripe from "stripe"


export const metadata = {
     title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
     params: Promise <{ id: string } >
}) => {
     const params = await props.params

     const { id } = params

     const order = await getOrderById(id)

     if(!order) notFound()

          const session = await auth()

 let client_secret  = null
   if(order.paymentMethod === 'stripe' && !order.isPaid) {
     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
     const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.totalPrice * 100), // Convert to cents
          currency: 'USD', // Change to your desired currency
          metadata: {
               orderId: order._id,
          },
     })

     client_secret = paymentIntent.client_secret
   }

          return (
               <PaymentForm 
                  order={order}
                    clientSecret={client_secret}
                  paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
                  isAdmin={session?.user?.role === 'admin' || false}
               />
          )
}

export default CheckoutPaymentPage;