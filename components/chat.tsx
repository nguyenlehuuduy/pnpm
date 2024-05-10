'use client'

import { type Message } from 'ai/react'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { helloMessage } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FeedbackForm from '@/components/feedback'
const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const params = useSearchParams()

  const [input, setInput] = useState<string>('')
  const [session, setSession] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([helloMessage])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!params.has('id')) {
      setMessages([helloMessage])
    } else {
      ; (async () => {
        try {
          const response = await fetch(`/api/chat?id=${params.get('id')}`)
          const chats = await response.json()
          setMessages([...chats])
        } catch (error) {
          setMessages([helloMessage])
        }
      })()
    }
  }, [params])

  const send = async (messages: Message[]) => {
    setIsLoading(true)
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: session,
        messages: messages.map(({ id, ...rest }) => ({ ...rest }))
      })
    })
    const data = await response.json()

    const { message, audio, sessionId } = data
    setSession(sessionId)
    setMessages(prev => [
      ...prev,
      { id: 'ai', content: message, role: 'system' }
    ])

    // convert audio string which is base64 to blob
    const blob = new Blob([Buffer.from(audio, 'base64')], {
      // type: 'audio/ogg;codecs=opus'
      type: 'audio/mp3'
    })
    const audioEl = new Audio(URL.createObjectURL(blob))
    audioEl.play()
    setIsLoading(false)
  }

  const append = async (message: Message) => {
    const newMessages = [...messages, message]
    setMessages(newMessages)

    await send(newMessages)
  }

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length && (
          <>
            <ChatList messages={messages} isLoading={isLoading} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
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
