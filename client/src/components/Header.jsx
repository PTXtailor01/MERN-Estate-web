import React from 'react'

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-400'>Real</span>
            <span className='text-slate-600'>Estate</span>
        </h1>
        <form action="">
            <input type="text" placeholder='Search...' />
        </form>
        </div>
    </header>
  )
}
