import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Renders the ProfilePage component which provides a user interface for
 * managing account details such as name, email, and password. The page uses
 * session data to display the current user's information and offers options
 * to edit these details. The editing functionality for email and password is
 * currently disabled and will be implemented in a future version. The page
 * includes navigation links to return to the main account page and to access
/*******  6d5385cb-1e13-40ae-b0b0-e9ba5b4389a3  *******/
export default async function ProfilePage() {
  const session = await auth()
  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2 '>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card className='max-w-2xl '>
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Name</h3>
              <p>{session?.user.name}</p>
            </div>
            <div>
              <Link href='/account/manage/name'>
                <Button className='rounded-full w-32' variant='outline'>
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Email</h3>
              <p>{session?.user.email}</p>
              <p>will be implemented in the next version</p>
            </div>
            <div>
              <Link href='#'>
                <Button
                  disabled
                  className='rounded-full w-32'
                  variant='outline'
                >
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Password</h3>
              <p>************</p>
              <p>will be implemented in the next version</p>
            </div>
            <div>
              <Link href='#'>
                <Button
                  disabled
                  className='rounded-full w-32'
                  variant='outline'
                >
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
