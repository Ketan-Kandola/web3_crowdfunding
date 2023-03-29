import React from 'react'
import {Route, Routes} from 'react-router-dom';

import { Navbar } from './components';
import CreateProject from './components/CreateProject';
import { CampaignDetails, Home, Profile, CampaignWithdrawal } from './pages';

const App = () => {
  return (
    //tailwind utility classes
    <div className="relative sm:-8 p-4 bg-[#f2f2f2] min-h-screen flex flex-row">
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>        
      </div>
    </div>
    
  )
}

export default App