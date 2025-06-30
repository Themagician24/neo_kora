import { EllipsisVertical, ShoppingCart, User, Sun, Moon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-3">
        <ThemeSwitcher />
        <UserButton />
        {!forAdmin && <CartButton />}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-800/50 focus-visible:ring-0"
            >
              <EllipsisVertical className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="bg-gray-900/95 backdrop-blur-md border-l border-gray-700 w-[280px]"
          >
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="text-xl font-bold text-white">
                Menu
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4">
              <ThemeSwitcher mobile />
              <Separator className="bg-gray-700" />
              
              <UserButton mobile />
              <Separator className="bg-gray-700" />

              {!forAdmin && (
                <>
                  <CartButton mobile />
                  <Separator className="bg-gray-700" />
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

// Composants internes optimisés
function ThemeSwitcher({ mobile = false }: { mobile?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 ${mobile ? 'px-2 py-4' : 'px-3'}`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span>{mobile ? 'Theme' : ''}</span>
    </Button>
  )
}

function UserButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 ${mobile ? 'px-2 py-4' : 'px-3'}`}
    >
      <User className="h-5 w-5" />
      <span>{mobile ? 'Account' : ''}</span>
    </Button>
  )
}

function CartButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 ${mobile ? 'px-2 py-4' : 'px-3'}`}
    >
      <ShoppingCart className="h-5 w-5" />
      <span>{mobile ? 'Cart' : ''}</span>
      <span className="ml-auto bg-cyan-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
        3
      </span>
    </Button>
  )
}

export default Menu