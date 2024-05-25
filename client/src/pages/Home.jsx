import React from 'react'

export default function Home() {

  const data = async (e)=>{
    const res = await fetch('/api/user/test/',{
      username:'abc'
    })
    console.log(data)
  }
  return (
    <div className='text-slate-600 text-xl'>Home</div>
  )
}
