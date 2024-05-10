// import { SidebarDesktop } from '@/components/sidebar-desktop'

import { Header } from '@/components/header'
import { SidebarDesktop } from '@/components/sidebar-desktop'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        {/* @ts-ignore */}
        <SidebarDesktop />
        <div className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[300px] peer-[[data-state=open]]:xl:pl-[420px] pt-4">
          {children}
        </div>
      </div>
    </>
  )
}
