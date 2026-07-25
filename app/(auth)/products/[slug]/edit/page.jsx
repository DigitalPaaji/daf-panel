import React from 'react'
import EditCompo from './EditCompo';

const page = async({params}) => {
     const {slug} = await params;
  return (
    <div>

<EditCompo slug={slug} />


    </div>
  )
}

export default page