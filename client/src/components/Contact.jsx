import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
    const [landlord , setLandlord] = useState(null);
    const[message,setMessage] =useState('');

    useEffect(()=>{
        const fetchLandlord = async ()=>{
            try {
                const response = await fetch(`/api/user/${listing.userRef}`);
                const data = await response.json();
                setLandlord(data);
            
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandlord();
    },[listing.userRef])

    const handleChange = (e)=>{
        setMessage(e.target.value);
    }
  return (
    <>
        {
            landlord && (
                <div className='flex flex-col gap-2 mt-7'>
                    <p className='text-lg'>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <textarea name="message" id="message" rows={2} value={message} onChange={handleChange} placeholder='Enter your message...' className='p-3 border border-slate-300 w-full rounded-lg'/>
                    <Link 
                        to={`mailto:${landlord.email}?subject=Regarding ${listing,name}&body=${message}`}
                        className='bg-slate-700 text-white uppercase p-3 rounded-lg text-center hover:opacity-95'
                        target='_blank'
                    >
                        Send Message
                    </Link>
                </div>
            )
        }
    </>
  )
}

export default Contact