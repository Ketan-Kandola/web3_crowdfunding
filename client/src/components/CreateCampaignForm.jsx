/**
 * CreateCampaignForm component displays a form input field with a label and placeholder text
 *
 * @param {string} labelName - The name of the label.
 * @param {string} placeholder - The placeholder text of the input field.
 * @param {string} inputType - The type of input field, can be text, number, etc.
 * @param {boolean} isTextArea - A boolean value to indicate if input is text area or not.
 * @param {string} value - The value of the input field.
 * @param {function} handleChange - A function to handle input field changes.
 * @returns {JSX.Element} A label containing an input field with the specified properties.
 */
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