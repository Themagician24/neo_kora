'use client'

import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Card, CardContent,  CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_NAME, AVAILABLE_PAYEMENT_METHODS, AVALILABLE_DELIVERY_DATES, DEFAULT_PAYMENT_METHOD } from '@/lib/constants'
import { calculateFutureDate, formatDateTime, timeUntilMidnight } from '@/lib/utils'
import { ShippingAddress } from '@/types'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import useIsMounted from '@/hooks/use-is-mounted'
import useCartStore from '@/hooks/use-cart-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ShippingAddressSchema } from '@/lib/validator'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createOrder } from '@/lib/actions/order.action'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, ChevronRight, MapPin, Package, CreditCard } from 'lucide-react'

const shippingAdressDefaultValues = 
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Ngoun',
        street: 'Dombe',
        city: 'Kribi',
        province: 'Ebolowa',
        phone: '1234567890',
        postalCode: 'kx2 237',
        country: "Le Continent",
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '',
        postalCode: '',
        country: "",
      }

const CheckoutForm = () => {
  const router = useRouter()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = DEFAULT_PAYMENT_METHOD,
    },
    setShippingAddress,
    setPaymentMethod,
    updateItem,
    removeItem,
    setDeliveryDateIndex,
    clearCart
  } = useCartStore()

  const isMounted = useIsMounted()

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAdressDefaultValues,
  })

  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values)
    setIsAddressSelected(true)
  }

  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    shippingAddressForm.setValue('fullName', shippingAddress.fullName)
    shippingAddressForm.setValue('street', shippingAddress.street)
    shippingAddressForm.setValue('city', shippingAddress.city)
    shippingAddressForm.setValue('country', shippingAddress.country)
    shippingAddressForm.setValue('postalCode', shippingAddress.postalCode)
    shippingAddressForm.setValue('province', shippingAddress.province)
    shippingAddressForm.setValue('phone', shippingAddress.phone)
  }, [items, isMounted, router, shippingAddress, shippingAddressForm])

  const [isAdressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState<boolean>(false)

  const handlePlaceOrder = async () => {
    const res = await createOrder({
      items,
      shippingAddress,
      expectedDeliveryDate: calculateFutureDate(
        AVALILABLE_DELIVERY_DATES[deliveryDateIndex!].daysToDeliver
      ),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })
  
    if (!res.success) {
      toast.error(res.message || "Error creating order.")
    } else {
      toast.success(res.message || "Order created successfully ✅")
    }
  
    clearCart()
    router.push(`/checkout/${res.data?.orderId}`)
  }

  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
  }

  const handleSelectShippingAddress = () => {
    shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
  }

  const CheckoutSummary = () => (
    <Card className="border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="p-6 space-y-6">
        {!isAdressSelected && (
          <div className="border-b pb-6 mb-6">
            <Button
              className="rounded-full w-full h-12 font-medium text-base"
              onClick={handleSelectShippingAddress}
            >
              Ship to this Address
            </Button>
            <p className="text-sm text-center text-muted-foreground pt-3">
              Choose a shipping address and payment method to calculate shipping, handling, and tax.
            </p>
          </div>
        )}
        
        {isAdressSelected && !isPaymentMethodSelected && (
          <div className="pb-6 mb-6">
            <Button
              className="rounded-full w-full h-12 font-medium text-base"
              onClick={handleSelectPaymentMethod}
            >
              Use this payment method
            </Button>
            <p className="text-sm text-center text-muted-foreground pt-3">
              Choose a payment method to continue. You&lsquo;ll still have a chance to review your order.
            </p>
          </div>
        )}

        {isPaymentMethodSelected && isAdressSelected && (
          <div className="space-y-4">
            <Button 
              onClick={handlePlaceOrder}
              className="rounded-full w-full h-12 font-medium text-base bg-primary hover:bg-primary/90"
            >
              Place your Order
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By placing your order, you agree to {APP_NAME}&#39;s{' '}
              <Link href="/page/privacy-policy" className="underline hover:text-primary">privacy notice</Link>{' '}
              and <Link href="/page/conditions-of-use" className="underline hover:text-primary">conditions of use</Link>.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items:</span>
              <span><ProductPrice price={itemsPrice} plain /></span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? '--' : 
                 shippingPrice === 0 ? (
                  <Badge variant="outline" className="text-green-600">FREE</Badge>
                 ) : (
                  <ProductPrice price={shippingPrice} plain />
                 )}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax:</span>
              <span>
                {taxPrice === undefined ? '--' : <ProductPrice price={taxPrice} plain />}
              </span>
            </div>
            
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Order Total:</span>
              <span className="text-primary"><ProductPrice price={totalPrice} plain /></span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-8">
          {/* Shipping Address Section */}
          <section>
            {isAdressSelected && shippingAddress ? (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddressSelected(false)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Change
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{shippingAddress.fullName}</p>
                      <p className="text-muted-foreground">{shippingAddress.street}</p>
                      <p className="text-muted-foreground">
                        {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}`}
                      </p>
                      <p className="text-muted-foreground">{shippingAddress.country}</p>
                      <p className="text-muted-foreground mt-2">{shippingAddress.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-primary text-primary">
                      1
                    </div>
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <Form {...shippingAddressForm}>
                    <form onSubmit={shippingAddressForm.handleSubmit(onSubmitShippingAddress)} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={shippingAddressForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={shippingAddressForm.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                          control={shippingAddressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingAddressForm.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Province</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter province" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingAddressForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={shippingAddressForm.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingAddressForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full mt-4 h-12">
                        Save Address
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Payment Method Section */}
          <section>
            {isPaymentMethodSelected && paymentMethod ? (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPaymentMethodSelected(false)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Change
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <p className="font-medium">{paymentMethod}</p>
                  </div>
                </CardContent>
              </Card>
            ) : isAdressSelected ? (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-primary text-primary">
                      2
                    </div>
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                    className="space-y-4"
                  >
                    {AVAILABLE_PAYEMENT_METHODS.map((pm) => (
                      <div key={pm.name} className="flex items-center space-x-3">
                        <RadioGroupItem value={pm.name} id={`payment-${pm.name}`} />
                        <Label htmlFor={`payment-${pm.name}`} className="font-normal">
                          {pm.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    onClick={handleSelectPaymentMethod}
                    className="w-full mt-6 h-12"
                  >
                    Continue to Delivery
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 opacity-50">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-muted-foreground text-muted-foreground">
                      2
                    </div>
                    <h2 className="text-lg font-semibold text-muted-foreground">Payment Method</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground">Complete shipping address first</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Delivery & Items Section */}
          <section>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold">Delivery & Items</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDeliveryDateSelected(false)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Change
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6">
                  <div className="flex items-start space-x-4">
                    <Package className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        Arriving on{' '}
                        <span className="text-green-600">
                          {formatDateTime(
                            calculateFutureDate(
                              AVALILABLE_DELIVERY_DATES[deliveryDateIndex].daysToDeliver
                            )
                          ).dateOnly}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order in the next {timeUntilMidnight().hours}h {timeUntilMidnight().minutes}m for this delivery date
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Your Items</h3>
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain rounded-md"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.color}, {item.size}
                            </p>
                            <p className="font-bold">
                              <ProductPrice price={item.price} plain />
                            </p>
                          </div>
                          <div>
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(value) => {
                                if (value === '0') removeItem(item)
                                else updateItem(item, Number(value))
                              }}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder={`Qty: ${item.quantity}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: item.countInStock }).map((_, i) => (
                                  <SelectItem key={i + 1} value={`${i + 1}`}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                                <SelectItem value="0">Remove</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : isPaymentMethodSelected && isAdressSelected ? (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-primary text-primary">
                      3
                    </div>
                    <h2 className="text-lg font-semibold">Delivery & Items</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Choose Delivery Option</h3>
                    <RadioGroup
                      value={AVALILABLE_DELIVERY_DATES[deliveryDateIndex!].name}
                      onValueChange={(value) =>
                        setDeliveryDateIndex(
                          AVALILABLE_DELIVERY_DATES.findIndex(
                            (address) => address.name === value
                          )!
                        )
                      }
                      className="space-y-4"
                    >
                      {AVALILABLE_DELIVERY_DATES.map((dd) => (
                        <div key={dd.name} className="flex items-start space-x-3">
                          <RadioGroupItem value={dd.name} id={`address-${dd.name}`} />
                          <Label htmlFor={`address-${dd.name}`} className="font-normal flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">
                                  {formatDateTime(calculateFutureDate(dd.daysToDeliver)).dateOnly}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {dd.daysToDeliver === 1 ? 'Next day delivery' : `${dd.daysToDeliver} day delivery`}
                                </p>
                              </div>
                              <div className="font-medium">
                                {(dd.freeShippingMinPrice > 0 && itemsPrice >= dd.freeShippingMinPrice) ? (
                                  <Badge variant="outline" className="text-green-600">FREE</Badge>
                                ) : (
                                  <ProductPrice price={dd.shippingPrice} plain />
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Review Items</h3>
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain rounded-md"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.color}, {item.size}
                            </p>
                            <p className="font-bold">
                              <ProductPrice price={item.price} plain />
                            </p>
                          </div>
                          <div>
                            <Select
                              value={item.quantity.toString()}
                              onValueChange={(value) => {
                                if (value === '0') removeItem(item)
                                else updateItem(item, Number(value))
                              }}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder={`Qty: ${item.quantity}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: item.countInStock }).map((_, i) => (
                                  <SelectItem key={i + 1} value={`${i + 1}`}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                                <SelectItem value="0">Remove</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsDeliveryDateSelected(true)}
                    className="w-full h-12"
                  >
                    Continue to Review
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 opacity-50">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-muted-foreground text-muted-foreground">
                      3
                    </div>
                    <h2 className="text-lg font-semibold text-muted-foreground">Delivery & Items</h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground">Complete payment method first</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Mobile Order Button */}
          {isPaymentMethodSelected && isAdressSelected && (
            <div className="block md:hidden">
              <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">
                        <ProductPrice price={totalPrice} plain />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Includes shipping and taxes
                      </p>
                    </div>
                    <Button onClick={handlePlaceOrder} className="h-12 px-6">
                      Place Order <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Desktop Order Summary */}
        <div className="hidden md:block">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}

export default CheckoutForm