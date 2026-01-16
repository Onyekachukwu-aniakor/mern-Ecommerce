import React from 'react'
import {TbBrandMeta} from 'react-icons/tb'
import {IoLogoInstagram} from 'react-icons/io'
import {RiTwitterXLine} from 'react-icons/ri'


const Topbar = () => {
  return (
    <div className='text-white bg-emerald-500'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4'>
            <div className='hidden md:flex  items-center space-x-4'>
                <a href="#" className='hover:text-gray-300'>
                    <TbBrandMeta  className='h-5 w-5'/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <IoLogoInstagram  className='h-5 w-5'/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <RiTwitterXLine  className='h-5 w-5'/>
                </a>
            </div>
            <div className='text-center text-sm flex-grow'>
              <span> We Ship Worldwide-fast and reliable shipping</span>

            </div>
            <div className='hidden md:block text-sm'>
              <a href="Tel: +447123456789" className='  hover:text-gray-300'>+447123456789</a>

            </div>

        </div>
    </div>
  )
}

export default Topbar