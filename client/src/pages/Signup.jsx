import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'

export default function Signup() {
  const [formData,setFormData] = useState({})
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success == false) {
        setError(data.message);
        setLoading(false);
        return ;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in')
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'> 
      <h1 className='text-3xl text-center font-semibold my-7'>Sign up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username'className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='email'className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='password'className='border p-3 rounded-lg' id='password' onChange={handleChange}/>

        <button type='submit' disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading? 'loading...': 'Sign up'}</button>


      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}><spam className='text-blue-700' >Sign in</spam></Link>
      </div>

      {error? <p className='text-red-700'>{error}</p>: null}

    </div>
  )
}
