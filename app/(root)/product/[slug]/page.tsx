import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'
import { Separator } from '@/components/ui/separator'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductSlider from '@/components/shared/product/product-slider'


export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams
  const { page, color, size } = searchParams

  const params = await props.params
  const { slug } = params

  const product = await getProductBySlug(slug)

  if (!product) {
    return <div>Product not found</div>
  }

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,
    page: Number(page || '1'),
  })

  return (
    <div>
      <AddToBrowsingHistory id={product._id} category={product.category} />

      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Galerie produit */}
          <div className="col-span-2">
            <ProductGallery images={product.images} />
          </div>

          {/* Informations produit */}
          <div className="flex w-full flex-col gap-4 col-span-2 md:p-5">
            <div className="flex flex-col gap-3">
              <p className="p-medium-16 rounded-full bg-gray-100 text-gray-600 px-3 py-1">
                {product.brand} • {product.category}
              </p>
              <h1 className="font-bold text-lg lg:text-xl">{product.name}</h1>
              <Separator />
              <ProductPrice
                price={product.price}
                listPrice={product.listPrice}
                isDeal={product.tags.includes('todays-deal')}
                forListing={false}
              />
            </div>

            {/* Variantes : couleur + taille */}
            <SelectVariant
              product={product}
              size={size || product.sizes[0]}
              color={color || product.colors[0]}
            />

            <Separator className="my-2" />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-gray-800">Description :</p>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>

          {/* Section achat */}
          <div className="col-span-1">
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                <ProductPrice price={product.price} />

                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className="text-red-600 font-bold">
                    Only {product.countInStock} left in stock - order soon
                  </div>
                )}

                {product.countInStock !== 0 ? (
                  <div className="text-green-600 text-lg font-semibold">In Stock</div>
                ) : (
                  <div className="text-red-600 text-lg font-semibold">Out of Stock</div>
                )}

                

                {/* Ajouter au panier si en stock */}
                {product.countInStock !== 0 && (
                  <div className="flex justify-center items-center">
                  <AddToCart
                    item={{
                      clientId: generateId(),
                      product: product._id,
                      countInStock: product.countInStock,
                      name: product.name,
                      slug: product.slug,
                      category: product.category,
                      price: round2(product.price),
                      quantity: 1,
                      image: product.images[0],
                      size: size || product.sizes[0],
                      color: color || product.colors[0],
                    }}
                  />
                  </div>
                )}


              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
        {/* <ReviewList product={product} userId={undefined} /> */}
      </section>

      {/* Produits similaires */}
      <section className="mt-10">
        <ProductSlider
          products={relatedProducts.data}
          title={`Best Sellers in ${product.category}`}
        />
      </section>

      {/* Historique de navigation */}
      <section className="mt-10">
        <BrowsingHistoryList />
      </section>
    </div>
  )
}
