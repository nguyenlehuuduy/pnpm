'use client'

import { type Message } from 'ai/react'

import { ChatPanel } from '@/components/chat-panel'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { ChatVolunteerList } from './chat-volunteer-list'
import { Header } from './header'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function ChatVolunteer({ id, initialMessages, className }: ChatProps) {
  // const router = useRouter()
  // const path = usePathname()
  // const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
  //   'ai-token',
  //   null
  // )
  const session = useSession()
  const router = useRouter()
  useEffect(() => {
    if (!session.data) {
      router.replace('/sign-in')
    }
  }, [router, session.data])
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ai',
      content: 'Xin chào bạn!',
      role: 'system'
    }
  ])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const append = async (message: Message) => {
    let newMessages = [...messages, message]
    setMessages(newMessages)

    setTimeout(() => {
      newMessages = [
        ...newMessages,
        {
          id: 'target',
          role: 'system',
          content: 'Xin chào bạn!'
        }
      ]

      setMessages(newMessages)
    }, 1000)

    // await send(newMessages)
  }

  return (
    <>
      <Header />
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length && (
          <ChatVolunteerList messages={messages} isLoading={isLoading} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        // stop={stop}
        append={append}
        // reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  )
}
