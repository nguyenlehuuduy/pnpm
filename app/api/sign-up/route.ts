import { NextResponse } from 'next/server'
import { connectMongoDB } from '@/lib/mongodb'
import User from '@/models/user'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password, birth, gender } = await req.json()

    await connectMongoDB()
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hashedPassword, birth, gender })
    return NextResponse.json(
      { message: 'User registerd successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while registering the user' },
      { status: 500 }
    )
  }
}
