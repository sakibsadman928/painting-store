import React from 'react'
import { Link } from 'react-router-dom'

const Mainbanner = () => {
  return (
    <div className="relative">
      <img src="banner.jpg" className='w-full h-96 object-cover hidden md:block' />
      
      {/* Overlay content positioned over the banner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center hidden md:flex">
        <div className='text-4xl max-w-md font-bold text-center leading-tight mb-8 text-black'>
          <h1>
            Make Walls Speak with Palette Play!
          </h1>
        </div>
        <div className='flex items-center justify-center font-medium gap-4'>
          <Link to="/products" className="group flex items-center gap-2 px-9 py-3 bg-[#bb86fc] hover:bg-[#9b6fe5] transition rounded text-white cursor-pointer" >
            Shop Now
            <span className='transition group-hover:translate-x-1'>→</span>
          </Link>
          <Link to="/exhibition" className="group flex items-center gap-2 px-9 py-3 bg-[#bb86fc] hover:bg-[#9b6fe5] transition rounded text-white cursor-pointer">
            Upcoming Events
            <span className='transition group-hover:translate-x-1'>→</span>
          </Link>
        </div>
      </div>

      {/* Mobile fallback - content below banner area */}
      <div className="md:hidden">
        <div className='text-3xl max-w-72 font-bold text-center leading-tight mx-auto mt-8'>
          <h1>
            Make Walls Speak with Palette Play!
          </h1>
        </div>
        <div className='flex items-center justify-center mt-6 font-medium gap-4'>
          <Link to="/products" className="group flex items-center gap-2 px-7 py-3 bg-[#bb86fc] hover:bg-[#9b6fe5] transition rounded text-white cursor-pointer" >
            Shop Now
            <span className='transition group-hover:translate-x-1'>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Mainbanner