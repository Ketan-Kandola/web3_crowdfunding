import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {logo, searchIcon, profilePic} from '../assets';
import {navlinks} from '../constants';
import {CustomButton} from './'
import { useStateContext } from '../context';
/*
const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)
*/
const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('home');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const {connect, address} = useStateContext();
  

  return (
    <header className="flex justify-between items-center p-5 bg-white shadow-lg fixed top-0 left-0 right-0">
      <Link to="/" className="flex justify-start items-center text-xl text-black space-x-1">
        <img src={logo} alt="logo" className="w-[156px] h-[52px] object-contain" />
      </Link>

      <div className="hidden sm:block sm:ml-6">
      <div className="flex space-x-4">
        <a href="/">Home</a>
        <a href="/ViewCampaigns">Campaigns</a>
        <a href="/profile">My Projects</a>
      </div>
      </div>

      <div className="lg:flex-1 flex flex row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#F2F2F2] rounded-[100px]">
        <input type="text" placeholder="Search for campaigns" className="flex w-full font-Rubik font-normal text-[14px] placeholder:text-[#C4C4C4] text-black bg-transparent outline-[#C4C4C4]" />
        <div className="w-[72px] h-full rounded-[20px] bg-[#10734F] flex justify-center items-center cursor-pointer">
          <img src={searchIcon} alt="search" className="w-[24px] h-[24px] object-contain" />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
      <CustomButton 
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect Wallet'}
          styles={address ? 'bg-[#10734F]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if(address) navigate('CreateCampaign')
            else connect()
          }}
          />
        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={profilePic} alt="user" className="w-[90%] h-[90%] object-contain" />
          </div>
        </Link>
      </div>
      
    </header>
  )
}

export default Navbar