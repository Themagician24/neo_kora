import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-none flex flex-col">
          <CardContent className="p-4 flex-1">
            <h3 className="text-xl font-bold mb-4">{card.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              {card.items.map((item) => (
                <Link key={item.name} href={item.href} className="flex flex-col">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="aspect-square object-scale-down max-w-full h-auto mx-auto"
                    width={120}
                    height={120}
                  />
                  <p className="text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>

          {/* ✅ Affiche le lien si présent */}
          {card.link && (
            <CardFooter>
              <Link
                href={card.link.href}
                className="mt-2 text-sm text-dark hover:underline"
              >
                {card.link.text}
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}