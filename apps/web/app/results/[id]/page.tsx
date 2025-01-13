'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const serachParams = useSearchParams();
  const result = serachParams.get('result');
  return (
    <h1>Result: {result}</h1>
  )
}

export default page