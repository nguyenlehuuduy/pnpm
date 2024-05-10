'use client'
// pages/index.js
import styles from '../styles/Home.module.css'
import header from '../styles/Header.module.css'
import footer from '../styles/Footer.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { Session } from 'inspector'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

import { Menu, Transition } from '@headlessui/react'

export default function Home() {
  // const session = useSession()
  const router = useRouter()
  const [logged, setLogged] = useState(false)

  const { data: session } = useSession()

  // useEffect(() => {
  //   if (session.data) {
  //     router.replace('/dashboard')
  //   }
  // }, [])

  return (
    <div className="flex flex-col w-full h-full bg-white ">
      <HeaderHome logged={logged} />
      <Banner />
      <div className="w-full md:h-[600px] bg-white flex flex-row gap-10 justify-center items-center ">
        <MainKey
          imageUrl="./mainkey/imgMainkey1.png"
          title="KHÔNG COI BẠN LÀ BỆNH NHÂN"
          content="Chúng tôi coi bạn là một bạn thân quen với những câu chuyện muốn chia sẻ. Thoại là người lắng nghe chân thành"
        />
        <MainKey
          imageUrl="./mainkey/imgMainkey2.png"
          title="KHÔNG GIAO TIẾP MÁY MÓC"
          content="Thoại không phải là máy móc, mà là một người bạn đồng hành cùng bạn trên mọi hành trình"
        />
        <MainKey
          imageUrl="./mainkey/imgMainkey3.png"
          title="KHÔNG LÀM BẠN CẢM THẤY CÔ ĐƠN"
          content="Thoại sẽ luôn ở đây, sẵn sàng lắng nghe và đồng hành cùng bạn"
        />
      </div>
      <div className="w-full lg:h-[600px] bg-secondaryBg flex flex-row justify-center items-center gap-10 ">
        <div className="flex flex-col w-[500px] items-center gap-3">
          <p className="text-3xl font-bold text-primaryButton">
            VẤN ĐỀ TÂM LÍ THƯỜNG GẶP
          </p>
          <img src="./statics/imgStatics1.png" className=" object-cover" />
        </div>

        <div className="flex flex-col w-[500px] items-center gap-3">
          <p className="text-3xl font-bold text-primaryButton">
            TÌNH TRẠNG TÂM LÍ Ở VIỆT NAM
          </p>
          <div className="flex flex-col justify-center items-center text-center">
            <p className="text-black md:max-w-[300px]">
              Không chỉ có bạn đang gặp vấn đề sức khỏe mà
            </p>
          </div>
          <img src="./statics/imgStatics2.png" className=" object-cover" />
          <div className="flex flex-col justify-center items-center text-center">
            <p className="text-black md:max-w-[300px]">
              giới trẻ mắc bệnh về tâm lí
            </p>
          </div>
        </div>
      </div>
      <BannerWhite />
      <div className="w-full lg:h-[600px] bg-secondaryBg flex flex-col gap-10 justify-center items-center ">
        <p className="text-primaryButton font-bold text-4xl">
          ĐẾN VỚI THOẠI CÓ NHỮNG TÍNH NĂNG GÌ
        </p>
        <div className="flex flex-row justify-center items-center gap-10">
          {secondMainkey.map((item, index) => {
            return (
              <MainKey2
                key={index}
                imageUrl={item.imageUrl}
                title={item.title}
                content={item.content}
              />
            )
          })}
        </div>
      </div>
      <div className="w-full relative lg:h-[900px] lg:mb-12">
        <div
          style={{
            backgroundImage: `url('./methodHome.png')`
          }}
          className="w-full h-full   bg-cover bg-center"
        ></div>
      </div>
      <FooterHome />
    </div>
  )
}

type HeaderHomeProps = {
  logged: boolean
  // setLogged: React.Dispatch<React.SetStateAction<boolean>>,
}

const HeaderHome: React.FC<HeaderHomeProps> = ({ logged }) => {
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <div className="flex flex-row justify-between   items-center bg-white py-6 px-10 lg:h-[100px]  w-full">
      <div className="flex flex-row justify-center items-center">
        <img
          src="./header/headerLogo.png"
          alt="logo"
          className="lg:w-[270px] lg:h-[70px] md:w-[150px] md:h-[40px]"
        />
      </div>
      <div className="flex flex-row justify-center items-center lg:gap-16 md:gap-8  ">
        <button
          onClick={() => {
            router.push('/chat')
          }}
          className="bg-primaryButton hover:cursor-pointer lg:min-h-[70px] md:h-[40px] md:w-[200px] md:text-[10px]   hover:zoom-in-105 hover:scale-110 hover:duration-150  lg:text-xl lg:w-[274px] text-white font-bold py-2 px-4 rounded-3xl"
        >
          Trò chuyện với Thoại
        </button>
        <button className="bg-primaryButton hover:cursor-pointer lg:min-h-[70px] md:h-[40px] md:w-[200px] md:text-[10px]   hover:zoom-in-105 hover:scale-110 hover:duration-150  lg:text-xl lg:w-[274px] text-white font-bold py-2 px-4 rounded-3xl">
          Trò chuyện với tình nguyện viên
        </button>
      </div>
      {/* avatar user */}
      <div className="flex flex-row justify-center items-center ">
        {session ? (
          <div className="flex lg:gap-4 items-center justify-center">
            <p className="font-bold lg:text-lg md:text-sm text-blue-700">
              {session?.user?.name}
            </p>
            <Menu as="div" className="relative">
              <Menu.Button as="div" className="flex items-center">
                <img
                  src="./header/avatarUser.jpg"
                  alt="avatar"
                  className="lg:w-[50px] lg:h-[50px] rounded-full md:w-[30px] md:h-[30px] hover:cursor-pointer hover:scale-105 hover:duration-150"
                />
              </Menu.Button>
              <Menu.Items
                as="div"
                className="absolute right-0 z-10 mt-2 w-48 bg-secondaryBg rounded-md shadow-lg"
              >
                <Menu.Item
                  as="div"
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex lg:gap-4 items-center justify-center">
                    <p className="font-bold lg:text-lg md:text-sm text-blue-700">
                      Logout
                    </p>
                  </div>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        ) : (
          <div className="flex lg:gap-5">
            <button
              onClick={() => {
                // setLogged(true)
                router.push('/sign-in')
              }}
              className="bg-transparent lg:p-1 text-primaryButton font-bold"
            >
              Đăng nhập
            </button>
            <button className="bg-secondaryBg rounded-lg lg:p-1 text-primaryButton font-bold">
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const Banner = () => {
  return (
    <div className="w-full relative lg:h-[750px]">
      <div
        style={{
          backgroundImage: `url('./header/Banner.png')`
        }}
        className="w-full h-full    bg-cover bg-center"
      >
        {/* button absolute */}
        <div className="flex flex-col lg:ml-[10%] lg:max-w-[450px] lg:gap-10">
          <div className="font-bold text-5xl lg:max-w-[400px] lg:mt-[80px] dark:text-white  text-white">
            Hệ thống hỗ trợ tâm lí giới trẻ{' '}
          </div>
          <p className="text-2xl text-white">
            Thoại sẽ luôn ở đây, sẵn sàng lắng nghe và đồng hành cùng bạn. Bắt
            đầu hành trình của bạn với Thoại ngay hôm nay và tận hưởng một ngày
            tràn đầy năng lượng và hạnh phúc !
          </p>
          <div className="bg-white hover:scale-110 hover:zoom-in-105 hover:duration-150  justify-center items-center flex rounded-xl hover:cursor-pointer text-primaryButton font-bold lg:mt-[18%] lg:w-[200px] lg:h-[50px]">
            Trò chuyện ngay
          </div>
        </div>
      </div>
    </div>
  )
}
const BannerWhite = () => {
  return (
    <div className="w-full relative lg:h-[800px]">
      <div
        style={{
          backgroundImage: `url('./aboutBanner.png')`
        }}
        className="w-full h-full   bg-cover bg-center"
      >
        {/* button absolute */}
        <div className="flex flex-col lg:ml-[10%] lg:max-w-[450px] lg:gap-10">
          <p className="text-black font-bold text-2xl  lg:mt-[80px]">
            Về chúng tôi
          </p>
          <div className="font-bold text-5xl text-primaryButton lg:max-w-[800px]">
            Phát hiện cũng như giúp đỡ những người bị tâm lý trở nên tốt đẹp hơn
          </div>
          <p className="text-lg text-black">
            Chúng tôi sẽ sử dụng cái tâm để giúp đỡ mọi người. như là một người
            bạn của bạn
          </p>
          <div className="bg-white hover:scale-110 hover:zoom-in-105 hover:duration-150 border-primaryButton border justify-center items-center flex rounded-xl hover:cursor-pointer text-primaryButton font-bold lg:mt-[5%] lg:w-[200px] lg:h-[50px]">
            Chi tiết
          </div>
        </div>
      </div>
    </div>
  )
}

interface MainKeyProps {
  imageUrl: string
  title: string
  content: string
}

const MainKey = ({ imageUrl, title, content }: MainKeyProps) => {
  return (
    <div className="bg-secondaryBg lg:w-[340px] lg:h-[410px] rounded-xl flex flex-col justify-center items-center gap-11 p-5 shadow-2xl">
      <img src={imageUrl} className="lg:w-24 lg:h-20" />
      <div className="text-primaryButton text-xl font-bold lg:max-w-[250px] text-center">
        {/* KHÔNG COI BẠN LÀ BỆNH NHÂN */}
        {title}
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <p className="text-black">
          {/* Chúng tôi coi bạn là một bạn thân quen với những câu chuyện muốn
        chia sẻ. Thoại là người lắng nghe chân thành */}
          {content}
        </p>
      </div>
    </div>
  )
}

const MainKey2 = ({ imageUrl, title, content }: MainKeyProps) => {
  return (
    <div className="bg-white lg:w-[340px] lg:h-[410px] rounded-xl flex flex-col justify-center items-center gap-11 p-5 shadow-2xl">
      <img src={imageUrl} className="lg:w-28 lg:h-24" />
      <div className="text-primaryButton text-xl font-bold lg:max-w-[250px] text-center">
        {/* KHÔNG COI BẠN LÀ BỆNH NHÂN */}
        {title}
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <p className="text-black">{content}</p>
      </div>
    </div>
  )
}

const secondMainkey = [
  {
    imageUrl: './mainkey2/img1.png',
    title: 'TẬN TÂM',
    content:
      'Yên tâm khi đến với Thoại bạn sẽ có được sự giúp đỡ rất tận tình từ các tình nguyện viên cũng như web'
  },
  {
    imageUrl: './mainkey2/img2.png',
    title: 'HỆ THỐNG CỰC KỲ THÔNG MINH',
    content:
      'Thuật toán MATCH giúp kết nối mọi người với nhau tạo tính liên kết'
  },
  {
    imageUrl: './mainkey2/img3.png',
    title: 'BOT CHAT',
    content:
      'Bạn không chỉ có sự giúp đỡ của mọi người mà còn có cả công nghệ AI tiên tiến'
  }
]

const FooterHome = () => {
  return (
    <div className="w-full bg-secondaryBg flex flex-col justify-center lg:p-5 items-center gap-10 lg:h-[360px]">
      <div className="flex flex-row">
        <img
          src="./header/headerLogo.png"
          alt="logo"
          className="lg:w-[350] lg:h-[50px]"
        />
        <p className="text-primaryButton text-3xl font-bold">
          {' '}
          INNOVATIVE TECHNOLOGY VIETNAM
        </p>
      </div>
      <div className="flex flex-row justify-between gap-40 items-center">
        <div className="flex flex-col text-primaryButton  ">
          <p className="font-bold">THÔNG TIN CÔNG TY</p>
          <p>Địa chỉ: 470 Trần Đại Nghĩa, Ngũ Hành Sơn, Đà Nẵng</p>
          <p>SDT: 0389650942</p>
          <p>Email: InoTeV@gmail.com </p>
        </div>
        <div className="flex flex-col text-primaryButton  ">
          <p className="font-bold">HỖ TRỢ KHÁCH HÀNG</p>
          <p>Giới thiệu</p>
          <p>Các mẫu đơn</p>
          <p>Các câu hỏi thường gặp </p>
        </div>
      </div>
      {/* make a horizontal thin line  */}
      <div className="w-full h-[0.5px] bg-black"></div>
      <div className="text-xs text-primaryButton lg:ml-[-30%]">
        Copyright © INOTEV | Designed by ITV Design Studio
      </div>
    </div>
  )
}
