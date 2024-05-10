import SignUpDialog from '@/components/sign-up-dialog'
import { getServerSession } from 'next-auth/next'

import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) redirect('/dashboard')
  return (
    <div>
      <SignUpDialog />
    </div>
  )
}
