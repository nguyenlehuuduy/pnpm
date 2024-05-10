import { Header } from '@/components/header'
import UserInfo from '@/components/userinfo'

export default async function Home() {
  return (
    <>
      <Header />
      <div>
        <img src="/home-page.png" alt="Home page" />
      </div>
    </>
  )
}
