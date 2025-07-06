
   import data from '@/lib/data'
import { HomeCarousel } from '../components/shared/home/home-carousel'

   export default async function Page() {
     return <HomeCarousel items={data.carousels} />
   }