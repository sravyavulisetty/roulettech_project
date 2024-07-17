import React from 'react';
import { RxCross2 } from "react-icons/rx";

interface ToastProps {
  showToast: boolean;
  toastMessage: string;
  onClose: () => void;
}

const Toast = ({ showToast, toastMessage, onClose }: ToastProps) => {
  return (
    <div
      className={`${
        showToast
          ? "px-2 py-2 rounded-md text-white bg-green-600 absolute top-10 left-[40%] flex flex-row justify-between items-center w-80"
          : "hidden"
      }`}
    >
      <p className='text-sm'>{toastMessage}</p>
      {showToast && <RxCross2 onClick={onClose} className="cursor-pointer" />}
    </div>
  );
}

export default Toast;

