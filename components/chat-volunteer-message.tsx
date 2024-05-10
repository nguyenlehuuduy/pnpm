import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { MemoizedReactMarkdown } from '@/components/markdown'
import { CodeBlock } from '@/components/ui/codeblock'
import { IconUser, IconVolunteer } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

export interface ChatMessageProps {
  message: Message
}

export function ChatVolunteerMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'group relative mb-4 flex items-start md:-ml-12',
        message.role === 'user' && 'justify-end flex-row-reverse'
      )}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user' ? 'bg-background' : 'bg-transparent border-0'
        )}
      >
        {message.role === 'user' ? (
          <IconUser />
        ) : (
          <IconVolunteer className="h-8 w-8" />
        )}
      </div>
      <div
        className={cn(
          'flex-1 px-4 py-2 ml-2 space-y-2 overflow-hidden border bg-white rounded-md max-w-[80%]',
          message.role === 'user' && 'ml-auto mr-2'
        )}
      >
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}