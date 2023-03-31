//aim to make the page responsive for small screens hence when creating the page include padding for smaller margins

import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {ethers} from 'ethers';

import { checkIfImage } from '../utils';
import {CustomButton, CreateCampaignForm} from '../components';
import { useStateContext } from '../context';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    // Use the useStateContext hook from the context.js file to get the createCampaign
    // function which is used to create a new crowdfunding campaign on the blockchain.
    const {createCampaign} = useStateContext();
    // Use the useState hook to define a state variable, form, and a function
    // setForm that can be used to update the state of form. The form variable is an
    // object that contains the values of the input fields in the form.
    const [form, setForm] = useState({
        name: '',
        title: '',
        description: '',
        goalAmount: '', 
        deadline: '',
        imageURL: ''
    });

    /**
     * Handle changes to the form input fields.
     * @param {string} fieldName - The name of the field being changed.
     * @param {object} e - The event object for the input field change.
     */
    const handleFormChange = (fieldName, e) =>{
        setForm({ ...form, [fieldName]: e.target.value })
    };

    /**
     * Handle form submission to create a new crowdfunding campaign on the blockchain.
     * @param {object} e - The event object for the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if the provided image URL is valid.
        checkIfImage(form.imageURL, async(exists) => {
            if(exists) {
                setIsLoading(true)
                // Call the createCampaign function to create a new crowdfunding campaign
                // on the blockchain with the data provided in the form.
                await createCampaign([ form.name, form.title, form.description, {goalAmount: ethers.utils.parseUnits(form.goalAmount, 18)}, form.deadline, form.imageURL ]);
                //await createCampaign({ ...form, goalAmount: ethers.utils.parseUnits(form.goalAmount, 18)}) //goalAmount is being parsed into units of ether. 18 in this case, which represents the number of decimal places in one ether.
                setIsLoading(false);
                navigate('/');
            } else {
                alert('Provide valid image URL')
                setForm({ ...form, imageURL: '' });
            } 
        })
    }
    
    // The CreateCampaign component renders a form with input fields for the user to fill out.
    return (
        <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && 'loader'}
            <div className="flex justify-center items center py-24 px-6">
                <h1 className="font-epilogue font-light sm:text-[61px] text-[48px] leading-[38px] text-[#0D0D0D]">Start your Campaign</h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                <div className="flex flex-wrap gap-[40px]">
                    <CreateCampaignForm 
                        labelName="Your Name"
                        placeholder="John Smith"
                        inputType="text"
                        value={form.name}
                        handleChange = {(e) => handleFormChange('name', e)}
                    />
                    <CreateCampaignForm 
                        labelName="Campaign Title"
                        placeholder="Enter the title of your campaign here"
                        inputType="text"
                        value={form.title}
                        handleChange = {(e) => handleFormChange('title', e)}
                    />
                </div>
                    <CreateCampaignForm 
                        labelName="Campaign Description"
                        placeholder="Please provide a description of the campaign you are launching, including the how it will be carried out and the intended impact."
                        isTextArea
                        value={form.description}
                        handleChange = {(e) => handleFormChange('description', e)}
                    />
                <div className="flex flex-wrap gap-[40px]">
                    <CreateCampaignForm 
                        labelName="Campaign Goal"
                        placeholder="0.1 ETH"
                        inputType="text"
                        value={form.goalAmount}
                        handleChange = {(e) => handleFormChange('goalAmount', e)}
                    />
                    <CreateCampaignForm 
                        labelName="Deadline"
                        placeholder="Please enter the deadline for your campaign"
                        inputType="date"
                        value={form.deadline}
                        handleChange = {(e) => handleFormChange('deadline', e)}
                    />
                    <CreateCampaignForm 
                        labelName="Image URL"
                        placeholder="Please enter the url for the image"
                        inputType="url"
                        value={form.imageURL}
                        handleChange = {(e) => handleFormChange('imageURL', e)}
                    />
                </div>
                <div className="flex justify-center items-center mt-[40px]">
                    <CustomButton 
                        btnType="submit"
                        title="Create your new campaign"
                        styles="bg-[#10734F]"
                    />
                </div>
            </form>     
        </div>
    )
}
export default CreateCampaign
