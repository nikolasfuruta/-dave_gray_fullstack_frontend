import React from 'react';
import { Outlet } from 'react-router-dom';
import PrivateHeader from './PrivateHeader';
import PrivateFooter from './PrivateFooter';

const PrivateLayout = () => {
  return (
    <>
      <PrivateHeader/>
      <div className='dash-container'>
        <Outlet/>
      </div>
      <PrivateFooter/>
    </>
  )
}

export default PrivateLayout