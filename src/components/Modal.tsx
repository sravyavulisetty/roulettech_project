import React from 'react'
import { RxCross2 } from "react-icons/rx";
interface ModalProps{
    children: JSX.Element,
    onRequestClose: ()=>void,
    title: string
}
const Modal = ({children, onRequestClose, title}: ModalProps) => {
  return (
    <div className='flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
      <div
        className="relative flex items-center justify-center z-20 h-full w-full bg-black/40 overflow-auto">
        <div
          className="relative w-1/2 h-fit max-w-lg p-10 bg-white rounded-lg flex flex-col"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
            <div className='flex flex-row justify-between items-center'>
                <h1 className='font-semibold'>{title}</h1>
                <button className='text-xl' onClick={onRequestClose}><RxCross2 size={25}/></button>
            </div>
          {children}
        </div>
      </div>
    </div> 
  )
}

export default Modal
