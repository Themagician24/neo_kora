'use client'

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { Card, CardContent } from '@/components/ui/card'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'
import CheckoutFooter from '../checkout-footer'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import { toast } from 'sonner'
import { approvePayPalOrder, createPaypalOrder } from '@/lib/actions/order.action'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeForm from './stripe-form'

// ✅ Chargement de la promesse Stripe une seule fois pour éviter les redéclarations
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function OrderDetailsForm({
  order,
  paypalClientId,
  clientSecret,
}: {
  order: IOrder
  paypalClientId: string
  clientSecret: string | null
  isAdmin: boolean
}) {
  const router = useRouter()

  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order

  // ✅ Rediriger si la commande est déjà payée
  if (isPaid) {
    redirect(`/account/orders/${order._id}`)
  }

  // ✅ État de chargement pour PayPal
  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    if (isPending) return <p className="text-sm text-muted">Chargement de PayPal...</p>
    if (isRejected) return <p className="text-sm text-destructive">Erreur de chargement PayPal.</p>
    return null
  }

  // ✅ Création de commande PayPal
  const handleCreatePayPalOrder = async () => {
    const res = await createPaypalOrder(order._id)
    if (!res.success) {
      toast.error(res.message)
      return
    }
    return res.data
  }

  // ✅ Approber la commande PayPal
  const handleApprovePayPalOrder = async (data: { orderId: string }) => {
    const res = await approvePayPalOrder(order._id, data)
    if (res.success) {
      toast.success(res.message)
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  // ✅ Résumé de la commande
  const CheckoutSummary = () => (
    <Card className="rounded-xl shadow-md">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">Récapitulatif de la commande</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Articles</span>
            <ProductPrice price={itemsPrice} plain />
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            {shippingPrice === undefined ? (
              '--'
            ) : shippingPrice === 0 ? (
              'Gratuit'
            ) : (
              <ProductPrice price={shippingPrice} plain />
            )}
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            {taxPrice === undefined ? '--' : <ProductPrice price={taxPrice} plain />}
          </div>
          <div className="flex justify-between font-bold text-base pt-3">
            <span>Total</span>
            <ProductPrice price={totalPrice} plain />
          </div>
        </div>

        {/* Paiement par PayPal */}
        {!isPaid && paymentMethod === 'PayPal' && (
          <div>
            <PayPalScriptProvider options={{ clientId: paypalClientId }}>
              <PrintLoadingState />
              <PayPalButtons
                createOrder={handleCreatePayPalOrder}
                onApprove={(data) => handleApprovePayPalOrder({ orderId: data.orderID })}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {/* Paiement par Stripe */}
        {!isPaid && paymentMethod === 'stripe' && clientSecret && (
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <StripeForm
              priceInCents={Math.round(order.totalPrice * 100)}
              orderId={order._id}
            />
          </Elements>
        )}

        {/* Paiement à la livraison */}
        {!isPaid && paymentMethod === 'Cash On Delivery' && (
          <Button
            className="w-full rounded-full"
            onClick={() => router.push(`/account/orders/${order._id}`)}
          >
            Voir la commande
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <main className="max-w-6xl mx-auto py-6 px-4 md:px-0">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          {/* Adresse de livraison */}
          <section>
            <h2 className="text-xl font-bold mb-2">Adresse de livraison</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {shippingAddress.fullName}<br />
              {shippingAddress.street}<br />
              {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
            </p>
          </section>

          {/* Méthode de paiement */}
          <section className="border-y py-4">
            <h2 className="text-xl font-bold mb-2">Méthode de paiement</h2>
            <p className="text-sm text-muted-foreground">{paymentMethod}</p>
          </section>

          {/* Détails des articles */}
          <section>
            <h2 className="text-xl font-bold mb-2">Articles commandés</h2>
            <p className="text-sm text-muted-foreground">
              Date de livraison : {formatDateTime(expectedDeliveryDate).dateOnly}
            </p>
            <ul className="text-sm mt-2 space-y-1">
              {items.map((item) => (
                <li key={item.slug}>
                  {item.name} x {item.quantity} = {item.price} €
                </li>
              ))}
            </ul>
          </section>

          {/* Footer de commande */}
          <div className="block md:hidden">
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>

        {/* Résumé pour desktop */}
        <aside className="hidden md:block">
          <CheckoutSummary />
        </aside>
      </div>
    </main>
  )
}
