import { Button } from "@/components/ui/button"
import { IProduct } from "@/lib/db/models/product.model"
import Link from "next/link"

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: IProduct
  color: string
  size: string
}) {
  // Détermine la couleur et taille sélectionnées (ou utilise les premières par défaut)
  const selectedColor = color || product.colors[0]
  const selectedSize = size || product.sizes[0]

  return (
    <>
      {/* Section de sélection des couleurs */}
      {product.colors.length > 0 && (
        <div className="space-x-2 space-y-2">
          <div>Color : </div>
          {product.colors.map((x: string) => (
            <Button
              asChild
              variant="outline"
              // Met en évidence la couleur sélectionnée
              className={
                selectedColor === x ? "border-2 border-primary" : "border-2"
              }
              key={x}
            >
              <Link
                replace  // Remplace l'URL actuelle dans l'historique
                scroll={false}  // Désactive le scroll vers le haut
                href={`?${new URLSearchParams({
                  color: x,
                  size: selectedSize,
                })}`}
                key={x}
              >
                {/* Affiche un indicateur visuel de couleur */}
                <div
                  style={{ backgroundColor: x }}
                  className="h-4 w-4 rounded-full border border-muted-foreground"
                ></div>
                {/* Nom de la couleur */}
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}

      {/* Section de sélection des tailles */}
      {product.sizes.length > 0 && (
        <div className="mt-2 space-x-2 space-y-2">
          <div>Size :</div>
          {product.sizes.map((x: string) => (
            <Button
              asChild
              variant="outline"
              // Met en évidence la taille sélectionnée
              className={
                selectedSize === x ? "border-2 border-primary" : "border-2"
              }
              key={x}
            >
              <Link
                replace  // Remplace l'URL actuelle dans l'historique
                scroll={false}  // Désactive le scroll vers le haut
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size: x,
                })}`}
              >
                {/* Valeur de la taille */}
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  )
}