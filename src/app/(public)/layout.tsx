import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { AuthProvider } from '@/components/AuthProvider'
import { LangProvider } from '@/components/LangProvider'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LangProvider>
        <Header/>
        {children}
        <Footer/>
        <MobileBottomNav/>
        <MobileDrawer/>
      </LangProvider>
    </AuthProvider>
  )
}
