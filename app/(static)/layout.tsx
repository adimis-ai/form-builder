import Section from '@/components/section'

interface StaticLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: StaticLayoutProps) {
  return <section className='h-screen'>{children}</section>
}
