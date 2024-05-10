'use client'

import header from '../styles/Header.module.css'
import footer from '../styles/Footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
  IconGg,
  ImgSign_in,
  IconNextChat,
  IconSeparator,
  IconFb
} from '@/components/ui/icons'
export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const session = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      if (res?.error) {
        toast.error('Thông tin xác thực không chính xác')
        return
      }
      router.replace('/')
    } catch (error) {
      console.log('Error during login :', error)
    }
  }

  return (
    <div className="bg-white mx-auto px-4 md:px-20 lg:px-14 xl:px-40 2xl:px-[234px] py-4 md:py-8 lg:py-12 xl:py-20 2xl:py-[121px] ">
      <div className="h-96 md:h-full grid grid-cols-1 md:grid-cols-2">
        <div className="w-full h-full ">
          <ImgSign_in />
        </div>
        <div className="bg-[#D3EEE6]">
          <div className="mx-auto md:mx-16 xl:mx-24  2xl:mx-32">
            <ul className="list-none flex gap-8 md:gap-[60px] items-center mt-2 md:mt-4 xl:mt-[25px] text-base md:text-base md:text-[22px]">
              <li className="font-sans p-0 leading-[1.15] text-black lg:text-xl">
                Nếu chưa có tài khoản bạn hãy!
              </li>
              <a href="/sign-up">
                <li className="font-bold leading-[1.15] text-black  lg:text-xl">
                  Đăng ký
                </li>
              </a>
            </ul>
            <h1 className=" items-center text-2xl md:text-[40px] font-bold mt-6 md:mt-5 2xl:mt-[55px]  text-black ">
              Thoại, xin chào!
            </h1>
            <p className="items-center text-base md:text-base md:text-[22px] font-sans leading-[1.15] text-black">
              Nhập thông tin đăng nhập
            </p>
            <form onSubmit={handleSubmit} className="xl:mt-[44px] lg:mt-6 mt-4">
              <div className="mb-3 lg:mb-4 xl:mb-[29px]">
                <label
                  htmlFor="email"
                  className="block mb-2 font-bold text-base md:text-[22px] leading-[1.15] text-black"
                >
                  Email/Số điện thoại
                </label>
                <input
                  className="text-base md:text-[22px] w-full px-5 py-[19px] border-spacing-2 border-gray-300 rounded-md focus:outline-none leading-[1.15]"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Nhập email hoặc số điện thoại"
                />
              </div>
              <div className="mb-[53px]">
                <label
                  htmlFor="password"
                  className="block mb-2 font-bold text-base md:text-[22px] leading-[1.15] text-black"
                >
                  Mật khẩu
                </label>
                <input
                  className="text-base md:text-[22px] w-full px-5 py-[19px] border-spacing-2 border-gray-300 rounded-md focus:outline-none leading-[1.15]"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                />
              </div>
              <button
                className=" mb-[26px] font-bold text-lg md:text-2xl md:px-6 lg:px-[60px] py-[19px] bg-[#176553] text-white  rounded-[48px] hover:scale-105 hover:duration-100 "
                type="submit"
              >
                Đăng nhập
              </button>
            </form>
            <div className=" flex items-center gap-[15px] ">
              <p className=" text-base md:text-[22px] text-black text-opacity-70 items-center justify-center align-center  ">
                Đăng nhập với
              </p>

              <a href="" onClick={() => signIn('google')}>
                <IconGg />
              </a>
              <a href="">
                {' '}
                <IconFb />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
