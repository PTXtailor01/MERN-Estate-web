import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleCLick =async ()=>{
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)
      const res = await fetch('/api/auth/google',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
        }),
      })
      const data = await res.json()
      dispatch(signInSuccess(data))
      navigate('/')
      
    } catch (error) {
      console.log('not with google..')
    }
  }
  
  return (
    <button type='button' onClick={handleGoogleCLick} className='bg-red-700 uppercase rounded-lg text-white p-3 hover:opacity-95'> Continue with Google</button>
  )
}

export default OAuth
