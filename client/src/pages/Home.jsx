import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingCard from '../components/ListingCard'

export default function Home() {
  const [offerListings, setOfferLisingd] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentLisingd] = useState([])

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/search?offer=true&limit=3`);
        const data = await res.json();
        setOfferLisingd(data);
        fetchRentListings();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/search?type=rent&limit=3`);
        const data = await res.json();
        setRentLisingd(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/search?type=sale&limit=3`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings();
  }, []);

  return (
    <div className='px-10'>
      {/* Top */}
      <div className='flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find you next <span className='text-slate-500'>perfect</span> <br />place with ease</h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Royal-Estate is the best place to find your next perfect place to live. <br />We have a wide ranvge of properties for you to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 hover:underline font-bold'>Let's get started now..</Link>
      </div>

      {/* swiper */}
      <div className='max-w-[1440px] mx-auto shadow-2xl'>

        <Swiper navigation={true} className='rounded-xl'>
          {
            offerListings && offerListings.length > 0 && offerListings.map((list, index) => (
              <SwiperSlide key={index} className=''>
                <div className="h-[500px]"
                  style={{
                    background: `url(${list.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover'
                  }}
                ></div>
              </SwiperSlide>
            ))
          }
        </Swiper>

      </div>
      {/* Listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-slate-600 font-semibold text-3xl">Recent offers</h2>
              <Link to={'/search?offer=true'} className="text-blue-800 hover:underline text-sm">View more</Link>
            </div>
            <div className="flex gap-4 flex-wrap ">
              {
                offerListings.map((list) => (
                  <ListingCard listing={list} key={list._id} />
                ))
              }
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-slate-600 font-semibold text-3xl">Recent places for rent</h2>
              <Link to={'/search?type=rent'} className="text-blue-800 hover:underline text-sm">View more</Link>
            </div>
            <div className="flex gap-4 flex-wrap ">
              {
                rentListings.map((list) => (
                  <ListingCard listing={list} key={list._id} />
                ))
              }
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-slate-600 font-semibold text-3xl">Recent place for sale</h2>
              <Link to={'/search?type=sale'} className="text-blue-800 hover:underline text-sm">View more</Link>
            </div>
            <div className="flex gap-4 flex-wrap ">
              {
                saleListings.map((list) => (
                  <ListingCard listing={list} key={list._id} />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
