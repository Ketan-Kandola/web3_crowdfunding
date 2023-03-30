//aim to make the page responsive for small screens hence when creating the page include padding for smaller margins

import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {ethers} from 'ethers';

import { checkIfImage } from '../utils';
import {CustomButton, CreateCampaignForm} from '../components';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        title: '',
        description: '',
        targetGoal: '', 
        deadline: '',
        imageUrl: ''
    });

    const handleSubmit = () => {};

    return (
        <div className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && 'loader'}
            <div className="flex justify-center items center py-24 px-6">
                <h1 className="font-epilogue font-light sm:text-[61px] text-[48px] leading-[38px] text-[#0D0D0D]">Start your Campaign</h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                <div className="flex flex-wrap gap-[40px]">
                    <CreateCampaignForm />
                </div>

            </form>
            
        </div>
    )
}
export default CreateCampaign
