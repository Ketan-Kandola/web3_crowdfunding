import React from 'react'

import { background } from '../assets'

const Home = () => {
  return (
    <div style={{ background: `url(${background})`, height: '100vh', width: '100%', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: 'white', fontSize: '4rem' }}>
        Welcome to Acute Awareness
      </h1>
    </div>
  )
}

export default Home