const data = {
     headerMenus: [
          {
               name: "Today's Deal",
               href:"/search?tag=today's deal",
          },
          {
               name: "New Arrivals",
               href:"/search?tag=new-arrivals",
          },
          {
               name: "Featured Products",
               href:"/search?tag=featured",
          },
          {
               name: "Best Sellers",
               href:"/search?tag=best-sellers",
              
          },
          {
               name: "Browsing History",
               href:"/#browsing-history",
             
          },
          {
               name: "Gift Cards",
               href:"/search?tag=gift-cards",
          },
          {
               name: "Customer Service",
               href:"/page/customer-service",
          },
          {
               name: "Contact Us",
               href:"/page/contact-us",
          },
          {
               name: "About Us",
               href:"/page/about-us",
          },
          {
               name: "Privacy Policy",
               href:"/page/privacy-policy",
          },
          {
               name: "Help",
               href:"/page/help",
          },
     ],
     carousels: [
          {
               title: 'Most Popular Shoes For Sale',
               buttonCaption: 'Shop Now',
               image: '/images/banner3.jpg',
               url:'/search?category=Shoes',
               isPublished: true,
          },
          {
               title: 'Best Seller in T-Shirts',
               buttonCaption: 'Shop Now',
               image: '/images/banner1.jpg',
               url:'/search?category=T-Shirts',
               isPublished: true,
          },
          {
               title: 'Best Deals on Wrist Watches',
               buttonCaption: 'See More',
               image: '/images/banner2.jpg',
               url:'/search?category=Wrist Watches',
               isPublished: true,
          },

     ],
}

export default data;