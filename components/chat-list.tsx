import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'

export interface ChatList {
  messages: Message[]
  isLoading: boolean
}

export function ChatList({ messages, isLoading }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div className="" key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && (
            // <Separator className="my-4 md:my-8" />
            <div className="md:my-4 xl:my-12"></div>
          )}
        </div>
      ))}
      {isLoading && (
        <>
          <Separator className="my-4 md:my-8" />
          <ChatMessage
            message={{
              id: 'ai',
              content: '...',
              role: 'system'
            }}
          />
        </>
      )}
    </div>
  )
}
