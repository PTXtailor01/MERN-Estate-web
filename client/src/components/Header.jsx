import React from 'react'
import { Link } from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {useSelector} from 'react-redux'

export default function Header() {

  const {currentUser} = useSelector(state => state.user)

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to={'/'}>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Real</span>
            <span className='text-slate-600'>Estate</span>
        </h1>
          </Link>
        <form action="" className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
            <FaSearch className='text-slate-600'></FaSearch>
        </form>
        <ul className='flex gap-5'>
          <Link to={'/'}>
          <li className='hidden sm:inline text-slate-700 hover:underline font-semibold'>Home</li>
          </Link>
          <Link to={'/about'}>
          <li className='hidden text-slate-700 hover:underline sm:inline font-semibold'>About</li>
          </Link>
          <Link to={'/profile'}>
            {currentUser? (
              <img className='rounded-full h-7 w-7 object-cover hover:border-2 border-slate-500' src={currentUser.avatar} alt='proofile' />
            ) : (
              <li className=' text-slate-700 hover:underline sm:inline font-semibold'>Sing in</li>
            )}
          </Link>
        </ul>
        </div>
    </header>
  )
}

