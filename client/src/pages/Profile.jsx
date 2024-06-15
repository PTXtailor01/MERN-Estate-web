import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { updateUserStart,updateUserFailure,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,SignOutUserFailure,SignOutUserStart,SignOutUserSuccess } from '../redux/user/userSlice'
import {useDispatch} from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Profile() {

  const fileRef = useRef(null)
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError , setFileUploadError] = useState(false)
  const [formData , setFormData] = useState({})
  const {currentUser,error , loading} = useSelector((state) => state.user);
  const [updateSuccess , setUpdateSuccess] = useState(false)
  const [showListingsError , setShowListingsError] = useState(false)
  const [lists,setLists] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',(snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setFormData({...formData,avatar :downloadURL})
      })
    })
  }

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]: e.target.value})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(formData)
        });
        const data = await res.json();
        if(data.success === false){
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async (e)=>{
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async (e)=>{
    e.preventDefault();
    try {
      dispatch(SignOutUserStart());
      const res =await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(SignOutUserFailure(data.message));
        return;
      }
      dispatch(SignOutUserSuccess(data));
    } catch (error) {
      dispatch(SignOutUserFailure(error.message));
    }
  }

  const handleShowListings = async ()=>{
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
      setShowListingsError(false);
      setLists(data);
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleDeleteListing = async (id)=>{
    try {
      const res =await fetch(`/api/listing/delete/${id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message)
        return;
      }
      setLists((prev)=> prev.filter((listing)=>listing._id !== id));
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/>
        <img src={formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
        {
          fileUploadError ? 
          <span className='text-red-700'>Error Iamge upload</span> :
          (filePerc>0 && filePerc<100 )? 
          <span className='text-green-700'>{`Uploading ${filePerc}%`}</span> :
          filePerc == 100 ?
          <span className='text-green-700'>Uploaded Successfully</span> : ""
        }
        </p>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange}/>
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        
        <button className='bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-75' disabled={loading} >{loading ? 'Loading...' : 'Updatte'}</button>
        <Link to={'/create-listing'} className='bg-green-700 text-center text-white rounded-lg uppercase p-3 hover:opacity-95'>Create Listing</Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User is updated successfully" : ""}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ""}</p>
      {
        lists && lists.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className=' text-center text-2xl font-semibold'>Your Listings</h1>
          {lists.map((list)=>(
            <div className='border border-slate-300 p-3 flex gap-4 justify-between items-center rounded-lg' key={list._id}>
              <Link to={`/listing/${list._id}`}>
                <img src={list.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain'/>
              </Link>
              <Link to={`/listing/${list._id}`} className=' flex-1 text-slate-700 font-semibold hover:underline truncate '>
                <p>{list.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button className=' uppercase text-red-700' onClick={()=>handleDeleteListing(list._id)}>Delete</button>
                <button className=' uppercase text-green-700' onClick={()=>navigate(`/update-listing/${list._id}`)}>Edit</button>
              </div>
            </div>
          )) } 
        </div>
      }
    </div>

  )
}
