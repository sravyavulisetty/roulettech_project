import React, { useState } from 'react'
import { FaUser } from "react-icons/fa6";
import { IoAddCircle } from "react-icons/io5";
import Button from './Button';

interface headerProps{
    onModalClick: () => void
}
const Header = ({onModalClick}: headerProps) => {
  
  return (
    <div className='flex justify-between items-center m-10'>
      <h1 className='font-bold text-xl text-[#373A40]'>Employee Details</h1>
      <div className='flex flex-row items-center gap-10'>
        <div>
           <Button className='bg-[#DC5F00] text-white px-3 py-2 rounded-xl' onClick={onModalClick}>
              <h4 className='flex flex-row items-center justify-center gap-2 text-sm'>New <IoAddCircle size={22}/></h4>
           </Button>
        </div>
        <div className='flex flex-row gap-2 items-start'>
           <FaUser size={20} color='#373A40'></FaUser>
           <h4>Sravya Vulisetty</h4>
        </div>
      </div>
    </div>
  )
}

export default Header
