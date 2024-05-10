'use client'
import Image from 'next/image'
import Link from 'next/link'
import header from '../styles/Header.module.css'
import footer from '../styles/Footer.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import {
  IconGg,
  ImgSign_up,
  IconNextChat,
  IconSeparator,
  IconFb
} from '@/components/ui/icons'

export default function SignUpDialog() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState('')

  const router = useRouter()

  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    if (!validateEmailFormat(email)) {
      toast.error('Định dạng Email không hợp lệ')
      return
    }

    try {
      const resUserExist = await fetch('api/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      })

      const { user } = await resUserExist.json()
      if (user) {
        toast.error('Email đã tồn tại')
        return
      }

      const res = await fetch('api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          birth,
          gender
        })
      })

      if (res.ok) {
        const form = e.target as HTMLFormElement
        form.reset()
        toast.success('Đăng ký thành công')
        router.push('/sign-in')
      } else {
        toast.error('Đăng ký người dùng không thành công')
      }
    } catch (error) {
      toast.error('Lỗi trong khi đăng ký :')
      console.log('Lỗi trong khi đăng ký : ', error)
    }
  }

  return (
    <div className="h-full bg-white mx-auto px-4 md:px-20 lg:px-30 xl:px-40 2xl:px-[234px] py-4 md:py-8 lg:py-12 xl:py-20 2xl:py-[121px] ">
      <div className=" h-96 md:h-full grid grid-cols-1 md:grid-cols-2">
        <div className="w-full h-full  ">
          <ImgSign_up />
        </div>
        <div className="bg-[#D3EEE6] shadow-md">
          <div className="mx-auto lg:mx-16 xl:mx-24  2xl:mx-32 lg:mt-5">
            <ul className="list-none flex gap-8 lg:gap-[60px] items-center mt-2 lg:mt-4 lg:mt-[25px] text-base lg:text-[22px]">
              <li className="font-sans p-0 leading-[1.15] text-black text-xl">
                Nếu đã có tài khoản bạn hãy !{' '}
              </li>
              <a href="/">
                <li className="font-bold leading-[1.15] text-black text-xl">
                  Đăng nhập
                </li>
              </a>
            </ul>
            <h1 className=" items-center text-2xl md:text-[40px] font-bold mt-6 md:mt-5 2xl:mt-[55px] text-black ">
              Xin chào!
            </h1>
            <p className="items-center text-base md:text-[22px] font-sans leading-[1.15] text-black">
              Hãy đăng ký tài khoản nhé !
            </p>
            <form onSubmit={handleSubmit} className="xl:mt-[44px] lg:mt-6 mt-4">
              <div className=" mb-3 lg:mb-4 xl:mb-[29px]">
                <label
                  htmlFor="email"
                  className="block mb-2 font-bold text-base md:text-[22px] leading-[1.15]  text-black"
                >
                  Họ và tên
                </label>
                <input
                  className="text-base md:text-[22px] w-full px-5 py-[19px] border-spacing-2 border-gray-300 rounded-md focus:outline-none leading-[1.15]"
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  onChange={e => setName(e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="mb-3 lg:mb-4 xl:mb-[29px]">
                <label
                  htmlFor="email"
                  className="block mb-2 font-bold text-base md:text-[22px] leading-[1.15]  text-black"
                >
                  Email/Số điện thoại
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={e => setEmail(e.target.value)}
                  className="text-base md:text-[22px] w-full px-5 py-[19px] border-spacing-2 border-gray-300 rounded-md focus:outline-none leading-[1.15]"
                  placeholder="Nhập email hoặc số điện thoại"
                />
              </div>
              <div className="mb-[25px]">
                <label
                  htmlFor="password"
                  className="block mb-2 font-bold text-[22px] leading-[1.15] text-black"
                >
                  Mật khẩu
                </label>
                <input
                  className="text-[22px] w-full px-5 py-[19px] border-spacing-2 border-gray-300 rounded-md focus:outline-none leading-[1.15]"
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
                className=" mb-[27px] font-bold  text-lg md:text-2xl px-4 md:px-6 lg:px-[60px] py-[19px] bg-[#176553] text-white hover:scale-105 hover:duration-150  rounded-[48px]"
                type="submit"
              >
                Đăng kí
              </button>
            </form>
            <div className=" flex items-center gap-[15px] ">
              <p className=" text-[22px] text-black text-opacity-70 items-center justify-center align-center ">
                Đăng ký với
              </p>
              <a href="">
                <IconGg />
              </a>
              <a href="">
                <IconFb />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
