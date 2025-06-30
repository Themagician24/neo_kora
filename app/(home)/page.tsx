import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import { HomeCard } from "@/components/shared/home/home-card";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import ProductSlider from "@/components/shared/product/product-slider";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCategories, getProductsByTag, getProductsForCard } from "@/lib/actions/product.actions";
import data from "@/lib/data";
import { toSlug } from "@/lib/utils";

export default async function Page() {
  const categories = (await getAllCategories()).slice(0, 4);
  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
    limit: 4
  });

  const featureds = await getProductsForCard({
    tag: 'featured',
    limit: 4
  });

  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
    limit: 4
  });

  const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: 'See More',
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      items: newArrivals,
      link: {
        text: "View All",
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: 'Discover Best Sellers',
      items: bestSellers,
      link: {
        text: "View All",
        href: '/search?tag=best-seller',
      },
    },
    {
      title: 'Featured Products',
      items: featureds,
      link: {
        text: "View All",
        href: '/search?tag=new-arrival',
      },
    }
  ];

  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' });
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' });

  return (
    <>
      <HomeCarousel items={data.carousels} />

      <div className="bg-gradient-to-br from-background to-muted md:p-6 p-4 space-y-6">

        <HomeCard cards={cards} />

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-3xl bg-white/20 backdrop-blur-lg shadow-xl hover:scale-[1.02] transition duration-500">
            <CardContent className="p-6 flex flex-col items-center gap-5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                Today&lsquo;s Deal
              </h2>
              <ProductSlider title="" products={todaysDeals} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white/20 backdrop-blur-lg shadow-xl hover:scale-[1.02] transition duration-500">
            <CardContent className="p-6 flex flex-col items-center gap-5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                Best Selling Products
              </h2>
              <ProductSlider
                title=""
                products={bestSellingProducts}
                hideDetails
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6 bg-background/80 backdrop-blur-lg rounded-t-3xl shadow-inner">
        <BrowsingHistoryList />
      </div>
    </>
  );
}
