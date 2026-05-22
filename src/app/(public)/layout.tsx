import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { MobileDrawer } from '@/components/layout/MobileDrawer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header/>
      {children}
      <Footer/>
      <MobileBottomNav/>
      <MobileDrawer/>
    </>
  )
}
