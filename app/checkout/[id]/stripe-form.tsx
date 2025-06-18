'use client'

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface StripeFormProps {
  priceInCents: number
  orderId: string
}

export default function StripeForm({ priceInCents, orderId }: StripeFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // 🧠 Fonction appelée lors de la soumission du formulaire Stripe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🚨 Vérifie que Stripe et Elements sont prêts
    if (!stripe || !elements) {
      toast.error("Stripe n'est pas prêt. Réessayez dans un instant.")
      return
    }

    setLoading(true)

    // ✅ Confirme le paiement via Stripe
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // 🔁 Redirection après le paiement réussi
        return_url: `${window.location.origin}/account/orders/${orderId}`,
      },
      redirect: 'if_required',
    })

    // ✅ Gestion des erreurs ou succès
    if (result.error) {
      toast.error(result.error.message || 'Échec du paiement. Réessayez.')
    } else if (result.paymentIntent?.status === 'succeeded') {
      toast.success('Paiement réussi ✅')
      router.push(`/account/orders/${orderId}`)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* 🎯 Affiche le widget Stripe avec les champs dynamiques */}
      <PaymentElement />

      <Button type="submit" className="w-full mt-4" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay €${(priceInCents / 100).toFixed(2)}`}
      </Button>
    </form>
  )
}
