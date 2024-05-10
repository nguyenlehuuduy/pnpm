import * as React from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { buttonVariants } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'

interface ChatHistoryProps {
  userId?: string
}

export async function ChatHistory({ userId }: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full bg-secondaryBg dark:bg-white dark:bg-opacity-10 ">
      {/* New Chat */}
      <div className="px-2 my-4 flex flex-row items-center justify-center gap-6">
        <div>
          {/* search bar */}
          <div className="relative flex items-center justify-center md:w-[280px] h-10 bg-zinc-50 rounded-md shadow-none dark:bg-zinc-900">
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              className=" h-full px-4 bg-transparent focus:outline-none dark:text-white"
            />
            <button className="absolute right-0 h-full px-4 text-zinc-600 dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17l-5-5"
                />
              </svg>
            </button>
          </div>
        </div>
        <Link
          href="/chat"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 flex rounded-xl justify-start items-center bg-zinc-50 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
          )}
        >
          <IconPlus className=" stroke-2" />
        </Link>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <SidebarList userId={userId} />
      </React.Suspense>
    </div>
  )
}
