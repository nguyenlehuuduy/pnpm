'use client'
import { clearChats } from '@/app/actions'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { Chat, ServerActionResult } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { cache, useEffect, useState } from 'react'
import FeedbackPopup from '@/components/feedback'
import { IconButton } from '@mui/material'
import { ThumbsUpIcon } from 'lucide-react'
interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

export async function getChats() {
  try {
    const response = await fetch('/api/chat')
    const { chats } = await response.json()

    return chats as Chat[]
  } catch (error) {
    return []
  }
}
const loadChats = cache(async () => await getChats())

export async function SidebarList({ userId }: SidebarListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const params = useSearchParams()
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    ; (async () => {
      try {
        const chatsData = await loadChats()
        setChats(chatsData)
      } catch (error) {
        setChats([])
      }
    })()
  }, [])

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden ">
        <div className="flex-1 overflow-auto ">
          {chats?.length ? (
            <div className="space-y-2 px-2 ">
              <SidebarItems chats={chats} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Không có lịch sử chat
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <ThemeToggle />
          <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
          <IconButton
            onClick={() => setShowFeedbackForm(true)}
            className="text-primaryButton dark:text-white p-2 rounded "
          >
            <ThumbsUpIcon />
          </IconButton>
        </div>
      </div>
      {showFeedbackForm && (
        <FeedbackPopup
          open={showFeedbackForm}
          onClose={() => setShowFeedbackForm(false)}
        />
      )}
    </>
  )
}
