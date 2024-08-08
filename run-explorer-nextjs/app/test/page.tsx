'use client';
import { useRouter } from 'next/navigation'
import React from 'react'

const Test = () => {
    const router = useRouter();
  return (
    <button onClick={()=>router.replace('../')}>Back</button>
  )
}

export default Test