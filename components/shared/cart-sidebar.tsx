import useCartStore from '@/hooks/use-cart-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { Button, buttonVariants } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { TrashIcon } from 'lucide-react'
import ProductPrice from './product/product-price'
import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background shadow-xl z-50 border-l border-gray-200 dark:border-gray-800 transition-all duration-300 transform translate-x-0">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
        </div>

        {/* Cart Items */}
        <ScrollArea className="flex-1 p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</div>
              <Link 
                href="/products" 
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'rounded-md hover:no-underline'
                )}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.clientId} className="mb-4 last:mb-0">
                <div className="flex gap-4">
                  <Link 
                    href={`/product/${item.slug}`} 
                    className="flex-shrink-0 relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  
                  <div className="flex-1">
                    <Link 
                      href={`/product/${item.slug}`} 
                      className="font-medium text-gray-900 dark:text-white hover:text-primary line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    
                    <div className="mt-1 text-sm font-bold text-primary">
                      <ProductPrice price={item.price} />
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <Select
                        value={item.quantity.toString()}
                        onValueChange={(value) => updateItem(item, Number(value))}
                      >
                        <SelectTrigger className="h-8 w-20 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: item.countInStock }).map((_, i) => (
                            <SelectItem value={(i + 1).toString()} key={i + 1}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))
          )}
        </ScrollArea>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                <ProductPrice price={itemsPrice} />
              </span>
            </div>
            
            {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
              <div className="text-sm text-green-600 dark:text-green-400 mb-4">
                🎉 Your order qualifies for FREE Shipping!
              </div>
            )}
            
            <Link
              href="/cart"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'w-full rounded-md hover:no-underline py-3 text-md font-semibold'
              )}
            >
              Proceed to Checkout
            </Link>
            
            <div className="mt-3 text-center">
              <Link 
                href="/products" 
                className="text-sm text-primary hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}