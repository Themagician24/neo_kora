import { toSlug } from "@/lib/utils"
import { HomeCard } from "../../components/shared/home/home-card"
import { HomeCarousel } from "../../components/shared/home/home-carousel"
import { getAllCategories, getProductsForCard } from "../../lib/actions/product.actions"



export default async function HomePage() {
     const categories = (await getAllCategories()).slice(0, 4)
     const newArrivals = await getProductsForCard({
       tag: 'new-arrival',
       limit: 4,
     })
     const featureds = await getProductsForCard({
       tag: 'featured',
       limit: 4,
     })
     const bestSellers = await getProductsForCard({
       tag: 'best-seller',
       limit: 4,
     })
     const cards = [
       {
         title: 'Categories to explore',
         link: {
           text: 'See More',
           href: '/search',
         },
         items: categories.map((category) => ({
           name: String(category),
           image: `/images/${toSlug(String(category))}.jpg`,
           href: `/search?category=${encodeURIComponent(String(category))}`,
         })),
       },
       {
         title: 'Explore New Arrivals',
         items: newArrivals,
         link: {
           text: 'View All',
           href: '/search?tag=new-arrival',
         },
       },
       {
         title: 'Discover Best Sellers',
         items: bestSellers,
         link: {
           text: 'View All',
           href: '/search?tag=new-arrival',
         },
       },
       {
         title: 'Featured Products',
         items: featureds,
         link: {
           text: 'Shop Now',
           href: '/search?tag=new-arrival',
         },
       },
     ]

     return (
       <>
         {/* Replace 'carousels' with an appropriate array or remove if not needed */}
         <HomeCarousel items={[]} />
         <div className='md:p-4 md:space-y-4 bg-border'>
           <HomeCard cards={cards} />
         </div>
       </>
     )
   }