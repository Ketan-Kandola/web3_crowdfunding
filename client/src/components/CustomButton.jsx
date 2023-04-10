/*
  Component Name: CustomButton
  Description: A reusable button component.
  Props:
    - btnType: string (required) -> The type of button. (e.g.'submit')
    - title: string (required) -> The text displayed on the button.
    - handleClick: function (required) -> The function to be executed when the button is clicked.
    - styles: string (optional) -> Custom styles for the button.
*/
import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
    <button
      type={btnType}
      className={`font-rubik font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton