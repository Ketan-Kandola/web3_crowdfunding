/*This is the layout for the boxes on campaign details page where it
takes two props, title and value, and returns a box element with the value
displayed at the center and the title displayed below it. 
When using this component in the campaign details page I can pass props to
customise the content of the box. */
import React from 'react'

const Box = ({title, value}) => {
  return (
    <div className="flex items-center w-[133px]">
        <h4 className='font-rubik font-regular text-[14px] text-[#F2F2F2] p-3 bg-[#A68A56] rounded-t-[8px] w-full text-center truncate'>
            {value}
            <p>{title}</p>
        </h4>
    </div>
  )
}

export default Box