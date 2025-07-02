import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'
import { CheckCircle2, Clock, Package, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getOrderById } from '@/lib/actions/order.action'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function SuccessPage(props: {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ payment_intent: string }>
}) {
  const params = await props.params
  const { id } = params

  const searchParams = await props.searchParams
  const order = await getOrderById(id)
  if (!order) notFound()

  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  )
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order._id.toString()
  )
    return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'
  if (!isSuccess) return redirect(`/checkout/${id}`)

  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center gap-6">
        {/* Success Icon */}
        <div className="relative">
          <CheckCircle2 className="h-16 w-16 text-green-500" strokeWidth={1.5} />
          <div className="absolute -inset-4 rounded-full bg-green-500/10 animate-pulse" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="text-muted-foreground max-w-prose">
            Your payment has been processed successfully. We&lsquo;ve sent a confirmation to your email.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="w-full mt-6 border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order #{order._id.toString().slice(-8).toUpperCase()}
              </h2>
              <Badge variant="outline" className="text-green-600 border-green-300">
                Paid
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Date</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Total</p>
                <p className="font-medium">${(order.totalPrice / 100).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Payment Method</p>
                <p>{order.paymentMethod}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Processing</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button asChild className="w-full">
              <Link href={`/account/orders/${id}`}>
                View order details
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Additional Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/products">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/account/orders">
              View all orders
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-sm text-muted-foreground mt-8">
          Need help? <Link href="/contact" className="underline hover:text-primary">Contact our support</Link>
        </div>
      </div>
    </main>
  )
}