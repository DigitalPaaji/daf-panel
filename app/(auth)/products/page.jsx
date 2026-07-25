"use client"
import ProductCompo from '@/app/components/ProductCompo'
import React, { Suspense } from 'react'

const page = () => {




  return (
    <div>

<Suspense fallback={<div>loading....</div>}>

<ProductCompo  />
</Suspense>


    </div>
  )
}

export default page