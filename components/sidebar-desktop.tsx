import { Sidebar } from '@/components/sidebar'
import { useSession } from 'next-auth/react'
// import { auth } from '@/auth'
import { ChatHistory } from '@/components/chat-history'
import nextAuth from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function SidebarDesktop() {
  // const session = await nextAuth(authOptions)

  // if (!session?.user?.id) {
  //   return null
  // }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30  hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[380px]">
      {/* @ts-ignore */}
      {/* <ChatHistory userId={session.user.id} /> */}
      <ChatHistory />
    </Sidebar>
  )
}
