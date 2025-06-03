

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NeoKora";

export const APP_SLOGAN = process.env.NEXT_PUBLIC_APP_SLOGAN || "Depensez moins, vivez mieux !";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "NeoKora est une application de E-Commerce pour les budgets bas qui vous aide à suivre vos dépenses et à économiser de l'argent. Avec NeoKora, vous pouvez facilement gérer vos finances et atteindre vos objectifs d'épargne.";

  export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © ${new Date().getFullYear()} ${APP_NAME}. Tous droits reservés.`;


  export const PAGE_SIZE = Number (process.env.PAGE_SIZE || 9)

  export const FREE_SHIPPING_MIN_PRICE = Number 
    (process.env.FREE_SHIPPING_MIN_PRICE || 35)

    export const AVAILABLE_PAYEMENT_METHODS = [
      {
        name: 'PayPal',
        commission: 0,
        isDefault: true
      },

      {
        name: 'Stripe',
        commission: 0,
        isDefault: false
      },

      {
        name: 'Cash On Delivery',
        commission: 0,
        isDefault: false
      },

      {
        name: 'Bank Transfer',
        commission: 0,
        isDefault: false
      },

      {
        name: 'Credit Card',
        commission: 0,
        isDefault: false
      },


    ]

    export const DEFAULT_PAYMENT_METHOD = 
    process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

    export const AVALILABLE_DELIVERY_DATES = [
      {
        name: 'Tomorrow',
        daysToDeliver: 1,
        shippingPrice: 12.9,
        freeShippingMinPrice: 0,
        
      },

      {
        name: 'Next 3 Days',
        daysToDeliver: 3,
        shippingPrice: 6.9,
        freeShippingMinPrice: 0,
        
      },

      {
        name: 'Next 5 Days',
        daysToDeliver: 5,
        shippingPrice: 4.9,
        freeShippingMinPrice: 35,
        
      },
    ]


    