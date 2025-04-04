import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm,setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }

  },[location.search])

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-[1440px] mx-auto p-3 px-6">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Royal</span>
            <span className="text-slate-600">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <button >
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-5">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:underline font-semibold">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden text-slate-700 hover:underline sm:inline font-semibold">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover hover:border-2 border-slate-500"
                src={currentUser.avatar}
                alt="proofile"
              />
            ) : (
              <li className=" text-slate-700 hover:underline sm:inline font-semibold">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
