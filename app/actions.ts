'use server'

import { kv } from '@vercel/kv'
import NextAuth from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { authOptions } from './api/auth/[...nextauth]/route'

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await NextAuth(authOptions)

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  //Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await NextAuth(authOptions)

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {
  const session = await NextAuth(authOptions)

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || chat.userId !== session.user.id) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}

export async function saveChat(chat: Chat) {
  const session = await NextAuth(authOptions)

  if (session && session.user) {
    const pipeline = kv.pipeline()
    pipeline.hmset(`chat:${chat.id}`, chat)
    pipeline.zadd(`user:chat:${chat.userId}`, {
      score: Date.now(),
      member: `chat:${chat.id}`
    })
    await pipeline.exec()
  } else {
    return
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}
// import Session, { ChatMessage } from '@/models/session'

// interface SessionDocument {
//   userId: string
//   title: string
//   summary: string
//   chat: ChatMessage[]
// }
// import User, { UserDocument } from '@/models/user'

// interface SessionDocument {
//   userId: string
//   title: string
//   summary: string
//   chat: ChatMessage[]
// }

// export async function getChats(userId: string): Promise<SessionDocument[]> {
//   try {
//     const chats = await Session.find({ userId }).exec()
//     return chats.map(chat => ({
//       userId: chat.userId.toString(),
//       title: chat.title,
//       summary: chat.summary,
//       chat: chat.chat
//     }))
//   } catch (error) {
//     console.error('Error fetching chats:', error)
//     throw new Error('Error fetching chats')
//   }
// }

// export async function getChat(
//   id: string,
//   userId: string
// ): Promise<SessionDocument | null> {
//   try {
//     const chat = await Session.findOne({ _id: id, userId }).exec()
//     return chat
//       ? {
//           userId: chat.userId.toString(),
//           title: chat.title,
//           summary: chat.summary,
//           chat: chat.chat
//         }
//       : null
//   } catch (error) {
//     console.error('Error fetching chat:', error)
//     throw new Error('Error fetching chat')
//   }
// }

// export async function removeChat(
//   id: string
// ): Promise<{ success: boolean; error?: string }> {
//   try {
//     await Session.deleteOne({ _id: id }).exec()
//     return { success: true }
//   } catch (error) {
//     console.error('Error removing chat:', error)
//     return { success: false, error: 'Error removing chat' }
//   }
// }

// export async function clearChats(
//   userId: string
// ): Promise<{ success: boolean; error?: string }> {
//   try {
//     await Session.deleteMany({ userId }).exec()
//     return { success: true }
//   } catch (error) {
//     console.error('Error clearing chats:', error)
//     return { success: false, error: 'Error clearing chats' }
//   }
// }

// export async function saveChat(chatData: {
//   userId: string
//   title: string
//   summary: string
//   chat: ChatMessage[]
// }): Promise<{ success: boolean; error?: string }> {
//   try {
//     const session = new Session(chatData)
//     await session.save()
//     return { success: true }
//   } catch (error) {
//     console.error('Error saving chat:', error)
//     return { success: false, error: 'Error saving chat' }
//   }
// }
