  import { NextResponse } from 'next/server'
  import { connectMongoDB } from '@/lib/mongodb'
  import Feedback from '@/models/feedback'
  import User from '@/models/user'
  import { getServerSession } from 'next-auth'
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
  export async function POST(req: Request) {
    
    try {
      const userId = await getUserIdFromSession()
      const { content } = await req.json();
      await connectMongoDB();
      await Feedback.create({ userId, content });
      return NextResponse.json(
        { message: 'Feedback submitted successfully', success: true },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: 'An error occurred while submitting feedback', success: false },
        { status: 500 }
      );
    }
  }
