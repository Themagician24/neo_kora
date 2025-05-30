import { auth } from '@/auth'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
// import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

// Composant affichant un bouton utilisateur avec menu déroulant selon qu'il est connecté ou non
export default async function UserButton() {

  // Récupération de la session utilisateur (connecté ou non)
  const session = await auth()

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        {/* Déclencheur du menu (affiche "Hello, Nom" + flèche) */}
        <DropdownMenuTrigger className='header-button' asChild>
          <div className='flex items-center'>
            <div className='flex flex-col text-xs text-left'>
              <span>
                Hello,
                {session ? session.user.name : 'Header.sign in'} {/* Affiche le nom ou "sign in" */}
              </span>
              <span className='font-bold'>Account & Orders</span>
            </div>
            <ChevronDownIcon />
          </div>
        </DropdownMenuTrigger>

        {session ? (
          // Si l'utilisateur est connecté, affichage d'un menu avec infos et liens
          <DropdownMenuContent className='w-56' align='end' forceMount>
            
            {/* Affiche le nom et l'e-mail */}
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {session.user.name}
                </p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>

            {/* Liens vers le compte et les commandes */}
            <DropdownMenuGroup>
              <Link className='w-full' href='/account'>
                <DropdownMenuItem>Your account</DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/orders'>
                <DropdownMenuItem>Your orders</DropdownMenuItem>
              </Link>

              {/* Si l'utilisateur est admin, lien vers la page d'administration */}
              {session.user.role === 'Admin' && (
                <Link className='w-full' href='/admin/overview'>
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>

            {/* Bouton de déconnexion dans un formulaire (POST) */}
            <DropdownMenuItem className='p-0 mb-1'>
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full py-4 px-2 h-4 justify-start'
                  variant='ghost'
                >
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          // Si l'utilisateur n'est pas connecté, propose de se connecter ou s'inscrire
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  className={cn(buttonVariants(), 'w-full')}
                  href='/sign-in'
                >
                  Sign in
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Invitation à s'inscrire si nouveau client */}
            <DropdownMenuLabel>
              <div className='font-normal'>
                New Customer?{' '}
                <Link href='/sign-up'>Sign up</Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
