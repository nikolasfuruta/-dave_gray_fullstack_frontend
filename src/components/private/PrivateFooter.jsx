import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const PrivateFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate('/dash');
  
  //if user location is different from /dash, then show btn
  let goHomeBtn = null;
  if(pathname !== '/dash'){
    goHomeBtn = (
      <button 
        className='dash-footer__button icon-button'
        title='Home'
        onClick={ onGoHomeClicked }
      >
        <FontAwesomeIcon icon={ faHouse }/>
      </button>
    )
  }

  const content = (
    <footer className="dash-footer">
      { goHomeBtn }
      <p>Current User:</p>
      <p>Status:</p>
    </footer>
  );

  return content
}

export default PrivateFooter