import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recently Viewed — Inside Thailand',
  description: 'Places you have recently viewed on Inside Thailand.',
}

export default function RecentlyViewedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
