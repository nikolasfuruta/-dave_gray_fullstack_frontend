import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../../features/auth/authApiSlice";

//regex
const PRIVATE_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const PrivateHeader = () => {
  //hooks
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //rtk
  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation();

  //effects
  useEffect(() => {
    if(isSuccess) navigate('/')
  }, [isSuccess, navigate]);

  //handler
  const onLogoutClicked = () => sendLogout();

  //checks
  if(isLoading) return <p>Loading Out...</p>
  if(isError) return <p>Error: { error.data?.message }</p>

  //define classes
  let privateClass = null;
  if(!PRIVATE_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
    privateClass = 'dash-header__container--small';
  }

  //btn
  const logoutButton = (
    <button
      className="icon-button"
      title="Logout"
      onClick={ onLogoutClicked }
    >
      <FontAwesomeIcon icon={ faRightFromBracket }/>
    </button>
  );

  const content = (
    <header className="dash-header">
      <div className={ `dash-header__container ${ privateClass }` }>
        <Link to='/dash'>
          <h1 className="dash-header__title">
            techNotes
          </h1>
        </Link>
        <nav className="dash-header__nav">
          {/*add more btn later*/}
          { logoutButton }
        </nav>
      </div>
    </header>
  );

  return content;
}

export default PrivateHeader