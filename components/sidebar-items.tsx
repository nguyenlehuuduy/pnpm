'use client'

import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { shareChat } from '@/app/actions'

import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'

interface SidebarItemsProps {
  chats?: Chat[]
}

export function SidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null

  const remove = async ({ id }: { id: string }) => {
    try {
      const response = await fetch(`/api/chat?id=${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <div className="flex flex-col gap-12 bg-white dark:bg-white dark:bg-opacity-10 lg:px-1 lg:py-3  rounded-xl">
              <motion.div
                key={chat?._id}
                exit={{
                  opacity: 0,
                  height: 0
                }}
              >
                <SidebarItem index={index} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={remove}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              </motion.div>
            </div>
          )
      )}
    </AnimatePresence>
  )
}
