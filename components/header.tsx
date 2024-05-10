'use client'

import * as React from 'react'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

import { cn } from '@/lib/utils'
// import { auth } from '@/auth'
// import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconLogo,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { useRouter } from 'next/navigation'
import { Menu } from '@headlessui/react'

// async function UserOrLogin() {
//   const session = await auth()
//   return (
//     <>
//       {session?.user ? (
//         <>
//           <SidebarMobile>
//             <ChatHistory userId={session.user.id} />
//           </SidebarMobile>
//           <SidebarToggle />
//         </>
//       ) : (
//         <Link href="/" target="_blank" rel="nofollow">
//           <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
//           <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" />
//         </Link>
//       )}
//       <div className="flex items-center">
//         <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
//         {session?.user ? (
//           <UserMenu user={session.user} />
//         ) : (
//           <Button variant="link" asChild className="-ml-2">
//             <Link href="/sign-in?callbackUrl=/">Login</Link>
//           </Button>
//         )}
//       </div>
//     </>
//   )
// }

export function Header() {
  const router = useRouter()
  const { data: session } = useSession()
  return (

    <div className="flex flex-row justify-between   items-center bg-white dark:bg-[#09090b] py-6 px-10 xl:h-[70px] md:h-[50px] sm:h-[80px] h-[80px] w-full">
      <Link href="/">
        <div className="xl:flex flex-row justify-center items-center lg:flex hidden">
          <img
            src="./header/headerLogo.png"
            alt="logo"
            className="lg:w-[270px] lg:h-[70px] md:w-[150px] md:h-[40px]"
          />
        </div>
      </Link>

      <div className="flex flex-row justify-center items-center lg:gap-16 md:gap-8  gap-7">

        <button
          onClick={() => {
            router.push('/chat')
          }}

          className="bg-primaryButton hover:cursor-pointer lg:h-[60px] xl:mb-1 md:h-[40px] md:w-[200px] md:text-[10px] sm:h-8 h-11 text-[10px]  hover:zoom-in-105 hover:scale-110 hover:duration-150  lg:text-base lg:w-[274px] text-white font-bold py-2 px-4 rounded-3xl"
        >
          Trò chuyện với Thoại
        </button>
        <button className="bg-primaryButton hover:cursor-pointer lg:h-[60px] xl:mb-1 md:h-[40px] md:w-[200px] md:text-[10px] sm:h-8 h-11 text-[10px]  hover:zoom-in-105 hover:scale-110 hover:duration-150  lg:text-base lg:w-[274px] text-white font-bold py-2 px-4 rounded-3xl">

          Trò chuyện với tình nguyện viên
        </button>
      </div>
      {/* avatar user */}

      <div className="md:flex flex-row justify-center items-center  hidden">

        {session ? (
          <div className="flex lg:gap-4 items-center justify-center">
            <p className="font-bold lg:text-lg md:text-sm dark:text-white text-blue-600">
              {session?.user?.name}
            </p>
            <Menu as="div" className="relative">
              <Menu.Button as="div" className="flex items-center">
                <img
                  src="./header/avatarUser.jpg"
                  alt="avatar"
                  className="lg:w-[50px] lg:h-[50px] rounded-full md:w-[30px] md:h-[30px] hover:cursor-pointer hover:scale-105 hover:duration-150"
                />
              </Menu.Button>
              <Menu.Items
                as="div"
                className="absolute right-0 z-10 mt-2 w-48 bg-secondaryBg rounded-md shadow-lg"
              >
                <Menu.Item
                  as="div"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex lg:gap-4 items-center justify-center">
                    <p className="font-bold lg:text-lg md:text-sm text-blue-700">
                      Logout
                    </p>
                  </div>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        ) : (
          <div className="flex lg:gap-5">
            <button
              onClick={() => {
                // setLogged(true)
                router.push('/sign-in')
              }}
              className="bg-transparent lg:p-1 text-primaryButton font-bold"
            >
              Đăng nhập
            </button>
            <button className="bg-secondaryBg rounded-lg lg:p-1 text-primaryButton font-bold">
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
