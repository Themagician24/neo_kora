
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


    