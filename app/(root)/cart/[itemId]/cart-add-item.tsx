"use client"

import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import ProductPrice from "@/components/shared/product/product-price";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCartStore from "@/hooks/use-cart-store";
import { FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";

import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function CartAddItem({ itemId } : { itemId: string }) {
  // On récupère les items du panier depuis le store global (zustand)
  const {
    cart: { items, itemsPrice },
  } = useCartStore()

  // On recherche l'item spécifique ajouté au panier
  const item = items.find((x) => x.clientId === itemId)

  // Si aucun item trouvé, on redirige vers une page 404
  if (!item) return notFound()

  return (
    <div>
      {/* Affichage du produit ajouté au panier */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <Card className="w-full rounded-none">
          <CardContent className="flex h-full items-center justify-center gap-3 py-4">
            {/* Image du produit avec lien vers la page produit */}
            <Link href={`/product/${item.slug}`}>
              <Image 
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Link>

            {/* Détails produit : nom, couleur, taille */}
            <div>
              <h3 className="text-xl font-bold flex gap-2 my-2">
                <CheckCircle2Icon className="h-6 w-6 text-green-700" />
                Added to Cart
              </h3>

              <p className="text-sm">
                <span className="font-bold">Color:</span> {item.color ?? '_'}
              </p>

              <p className="text-sm">
                <span className="font-bold">Size:</span> {item.size ?? '_'}
              </p>
            </div>
          </CardContent>
        </Card>



        {/* Résumé panier et message livraison gratuite */}
        <Card className="w-full rounded-none">
          <CardContent className="p-4 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              


              {/* Message pour inciter à atteindre la livraison gratuite */}
              <div className="flex justify-center items-center">
                {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                  <div className="text-center">
                    Add{" "}
                    <span className="text-green-700">
                      <ProductPrice
                        price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                        plain
                      />
                    </span>{" "}
                    of eligible items to your order to qualify for Free Shipping
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div>
                      <span className="text-green-700">
                        Your order qualifies for FREE Shipping
                      </span>{" "}
                      Choose this option at checkout
                    </div>
                  </div>
                )}
              </div>



              {/* Actions checkout et accès panier */}
              <div className="lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3">
                {/* Total panier */}
                <div className="flex gap-3">
                  <span className="text-lg font-bold">Cart Subtotal:</span>
                  <ProductPrice className="text-2xl" price={itemsPrice} />
                </div>



                {/* Lien vers la page de paiement */}
                <Link 
                  href='/checkout'
                  className={cn(buttonVariants(), 'rounded-full w-full')}
                >
                  Proceed to Checkout (
                    {items.reduce((a, c) => a + c.quantity, 0)} items
                  )
                </Link>



                {/* Lien vers la page panier complète */}
                <Link
                  href='/cart'
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'rounded-full w-full'
                  )}
                >
                  Go to Cart
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Historique de navigation en bas de page */}
      <BrowsingHistoryList />
    </div>
  )
}
