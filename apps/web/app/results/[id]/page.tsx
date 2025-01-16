'use client'
import { CheckCircle, Star, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500)
    return () => clearTimeout(timer)
  }, [])


  const serachParams = useSearchParams();
  const result = serachParams.get('result');
  const isPassed = result === "passed"

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
      <div className={`transform transition-all duration-1000 ease-out ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          {isPassed ? (
            <>
              <div className="text-center">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 pulse" />
                <h1 className="text-3xl font-bold text-green-600 mb-2 float">Congratulations!</h1>
                <p className="text-xl text-gray-700 mb-4 fade-in">You passed the interview!</p>
              </div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`absolute text-yellow-400 spin`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                    '--i': `${(3+i)}s`
                  } as React.CSSProperties & { '--i'?: string | number }} 
                />
              ))}
            </>
          ) : (
            <div className="text-center">
              <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4 shake" />
              <h1 className="text-3xl font-bold text-red-600 mb-2 float">Oh no!</h1>
              <p className="text-xl text-gray-700 mb-4 fade-in">You didn't pass this time.</p>
            </div>
          )}

         
        </div>
      </div>
    </div>
  )
}

export default page