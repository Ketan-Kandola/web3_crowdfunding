import React from 'react'

const CreateCampaignForm = ({labelName, placeholder, inputType, isTextArea, value, handleChange}) => {
  return (
    <label className='flex-1 w-full flex flex-col'>
        {labelName && (
            <span className='font-rubik font-medium text-[16px] leading-[22px] text-[#0D0D0D] mb-[10px]'>{labelName}</span>
        )}
        {isTextArea ? (
            <textarea
                required
                value={value}
                onChange={handleChange}
                rows={10}
                placeholder={placeholder}
                className='py-[4px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#404040] bg-transparent font-rubik text-[#404040] text-[14px] placeholder:text-[#ADADAD] rounded-[8px] sm:min-w-[300px]'
            />
        ) : (
            <input 
                required
                value={value}
                onChange={handleChange}
                type={inputType}
                step="0.1"
                placeholder={placeholder}
                className='py-[4px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#404040] bg-transparent font-rubik text-[#404040] text-[14px] placeholder:text-[#ADADAD] rounded-[8px] sm:min-w-[300px]'
            />
        )}
    </label> 
  )
}

export default CreateCampaignForm