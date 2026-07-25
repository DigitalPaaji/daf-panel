"use client"
import React, { Suspense } from 'react'
import UserCompo from './UserCompo'

const page = () => {

   

  return (
    <div>


<Suspense fallback={<div>loading...</div>}>
<UserCompo  />
</Suspense>

    </div>
  )
}

export default page