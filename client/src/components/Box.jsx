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