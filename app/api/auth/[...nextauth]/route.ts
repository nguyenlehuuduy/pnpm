import { connectMongoDB } from '@/lib/mongodb'
import User, { UserDocument } from '@/models/user'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import GoogleProvider from 'next-auth/providers/google'
import {
  DefaultSession,
  NextAuthOptions,
  User as NextAuthUser
} from 'next-auth'
import { getSession } from 'next-auth/react'
import React from 'react'
import { encode } from 'next-auth/jwt'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        try {
          await connectMongoDB()
          const user = await User.findOne({ email })

          if (!user) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (!passwordsMatch) {
            return null
          }

          return user
        } catch (error) {
          console.log('Error: ', error)
        }
      }
    })
  ],
  callbacks: {
    async session({ session, trigger, newSession }) {
      if (trigger === 'update' && newSession?.user) {
        session.user = newSession.user
      }
      return session
    },
    async signIn({ profile, user }) {
      try {
        if (profile || user) {
          console.log('Profile: ', profile)
          await connectMongoDB()

          let newUser: UserDocument | null = null
          if (profile) {
            const userExists = await User.findOne({ email: profile.email })
            if (!userExists) {
              newUser = await User.create({
                email: profile.email,
                name: profile.name
              })
            }
          } else if (user) {
            newUser = user as UserDocument
          }
          const userId = newUser ? newUser._id : (user as NextAuthUser)?.id
          const session = await getSession()
          if (session) {
            session.user = {
              ...session.user,
              id: userId.toString()
            }
          }
          encode({
            secret: process.env.NEXTAUTH_SECRET || '',
            token: { ...session?.user, id: userId.toString() },
            maxAge: 30 * 24 * 60 * 60
          })
          return true
        }
        return false
      } catch (error) {
        console.log('Error: ', error)
        return false
      }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 * 1000
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
