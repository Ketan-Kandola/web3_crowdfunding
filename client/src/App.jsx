import React from 'react'
import {Route, Routes} from 'react-router-dom';

import { CampaignDetails, Home, Profile } from './pages';
import { navbar } from './components';

const App = () => {
  return (
    //tailwind utility classes
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>

    </div>
  )
}

export default App