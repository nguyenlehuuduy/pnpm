import OpenAI from 'openai'
import { systemMessage } from '@/lib/constants'
import Session from '@/models/session'
import { getServerSession } from 'next-auth/next'
import User from '@/models/user'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Hàm lấy userId từ session
export async function getUserIdFromSession() {
  try {
    const session = await getServerSession()
    console.log({ session })

    if (session && session.user && session.user.email) {
      return await (
        await User.findOne({ email: session.user.email })
      )._id
    } else {
      console.log('Session or userId not found:', session)
      return null
    }
  } catch (error) {
    console.error('Error getting userId from session:', error)
    return null
  }
}

// Hàm xử lý request POST
export async function POST(req: Request) {
  const json = await req.json()
  let { messages, previewToken, sessionId } = json

  const userId = await getUserIdFromSession()

  if (previewToken) {
    openai.apiKey = previewToken
  }

  console.log({ messages })

  const textRes = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, ...messages],
    temperature: 0.7
  })

  const message = textRes.choices[0].message.content
  if (!message) {
    return new Response('Error', {
      status: 500
    })
  }
  // Kiểm tra số lượng tin nhắn của người dùng
  if (userId) {
    const user = await User.findOne({ _id: userId })

    if (user) {
      const userMessageCount = user.messageCount || 0
      const maxMessageCount = 10

      if (userMessageCount >= maxMessageCount) {
        // Gửi thông báo về phía client
        return new Response(
          JSON.stringify({
            error: 'Bạn đã vượt quá số lượng tin nhắn tối đa cho phép.'
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }

      user.messageCount = userMessageCount + 1
      await user.save()
    }
  }
  if (!sessionId) {
    sessionId = await (
      await Session.create({
        userId,
        chat: [...messages, { role: 'system', content: message }],
        title: messages.find((s: any) => s.role === 'user')?.content ?? ''
      })
    ).id
  } else if (sessionId) {
    await Session.findOneAndUpdate(
      { _id: sessionId },
      { chat: [...messages, { role: 'system', content: message }] }
    )
  }

  const voiceRes = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: message,
    speed: 1.3,
    response_format: 'mp3'
  })

  let chunks = []
  for await (const chunk of voiceRes.body as any) {
    chunks.push(chunk)
  }

  return new Response(
    JSON.stringify({
      sessionId,
      message,
      audio: Buffer.concat(chunks).toString('base64')
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    }
  )
}

export async function GET(req: Request) {
  const url = new URL(req.url)

  const id = url.searchParams.get('id')

  if (id) {
    try {
      const chat = await Session.findOne({ _id: id })
      console.log({ chat })

      return new Response(JSON.stringify(chat.chat), {
        status: 200,
        headers: {
          'content-type': 'application/json'
        }
      })
    } catch {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'content-type': 'application/json'
        }
      })
    }
  }
  const userId = await getUserIdFromSession()
  let chats = []
  // Kiểm tra số lượng tin nhắn của người dùng
  if (userId) {
    const user = await User.findOne({ _id: userId })

    if (user) {
      try {
        chats = await Session.find({ userId }).sort({ createdAt: -1 })
      } catch {
        chats = []
      }
    }
  }

  return new Response(
    JSON.stringify({
      chats
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    }
  )
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)

  const id = url.searchParams.get('id')

  const userId = await getUserIdFromSession()
  // Kiểm tra số lượng tin nhắn của người dùng
  if (userId) {
    const user = await User.findOne({ _id: userId })

    if (user && id) {
      try {
        const chat = await Session.findOne({ _id: id, userId })
        await Session.deleteOne({ _id: id, userId })
        return new Response(JSON.stringify({ deleted: true }), {
          status: 200,
          headers: {
            'content-type': 'application/json'
          }
        })
      } catch {
        return new Response(JSON.stringify({ deleted: false }), {
          status: 400,
          headers: {
            'content-type': 'application/json'
          }
        })
      }
    }
  }

  return new Response(JSON.stringify({}), {
    status: 403,
    headers: {
      'content-type': 'application/json'
    }
  })
}
