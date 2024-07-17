import React from 'react'
interface buttonProps{
    children: JSX.Element,
    className: string,
    onClick: ()=> void
}
const Button = ({children, className, onClick}: buttonProps) => {
  return (
    <button className={`${className} cursor-pointer`} onClick={onClick}>
        {children}
    </button>
  )
}

export default Button
