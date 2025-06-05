'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { TopNavigation } from '@/components/TopNavigation'

const CascadeStudio = dynamic(() => import('@/components/CascadeStudio'), {
  ssr: false,
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#111',
        color: 'white'
      }}>
        Loading Cascade Studio...
      </div>
    )
  }

  return (
    <main>
      <TopNavigation />
      <CascadeStudio />
    </main>
  )
}
