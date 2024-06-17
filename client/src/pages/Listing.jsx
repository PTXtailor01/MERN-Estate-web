import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper , SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {useSelector} from 'react-redux';
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from 'react-icons/fa';
import Contact from "../components/Contact";

const Listing = () => {
    SwiperCore.use([Navigation])
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  const [contact ,setContact] = useState(false);
  const [copied ,setCopied] = useState(false)

  console.log(listing)
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setError(false);
        setListing(data);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && (<p className="text-center my-7 text-2xl font-semibold">Loading...</p>)}
      {error && (<p className= "text-center my-7 text-2xl text-red-700 font-semibold">Something went wrong!</p>)}
      {listing && !loading && !error && <>
        <Swiper navigation={true}>
            {listing.imageUrls.map((url)=>(
                <SwiperSlide key={url}>
                    <div className="h-[350px] sm:h-[450px]" style={{background: `url("${url}") center no-repeat`, backgroundSize:'cover'}}></div>
                </SwiperSlide>
            ))}
        </Swiper>
        {/* For share button */}
        <div className="fixed top-[13%] right-[3%] z-10 cursor-pointer bg-slate-800 h-10 w-10 rounded-full flex justify-center items-center text-lg">
            <FaShare className="text-slate-400"
            onClick={()=>{
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(()=>{setCopied(false)},2000);
            }}/>
        </div>
        {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">Link copied!</p>
        )}
        {/* ............. */}
        <div className="flex flex-col max-w-4xl mx-auto p3 my-7 gap-4 p-3">
            <p className="text-2xl font-semibold">{listing.name}- Rs{' '}
                {listing.offer ? listing.discountedPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm"><FaMapMarkerAlt className=" text-green-700"/>{listing.address}</p>
            <div className="flex gap-4">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg">{listing.type === 'rent' ? 'For rent' : 'For sale'}</p>
                {listing.offer && (
                    <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-lgbg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg">Rs. {+listing.regularPrice - +listing.discountedPrice} OFF</p>
                )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className=" text-green-900 flex gap-4 sm:gap-6 font-semibold text-sm flex-wrap">
                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaBed className="text-lg"/>
                    {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                </li>
                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaBath className="text-lg"/>
                    {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                </li>
                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaParking className="text-lg"/>
                    {listing.parking ? 'Parking spot' : `No Parking`}
                </li>
                <li className="flex gap-1 items-center whitespace-nowrap">
                    <FaChair className="text-lg"/>
                    {listing.furnished ? `Furnished` : `Unfurnished`}
                </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button onClick={()=>setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-2">Contact landlord</button>
            )}
            {contact && (<Contact listing={listing}/>)}
        </div>
      </>}
    </main>
  );
};

export default Listing;
