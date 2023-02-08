import React, { useState,useEffect } from 'react';
import { useAddNewUserMutation } from './userApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../../config/roles';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
  const navigate = useNavigate();

  //rtk hooks
  const [ addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  } ] = useAddNewUserMutation();

  //states
  const [username,setUsername] = useState('');
  const [validUsername,setValidUsername] = useState(false);
  const [password,setPassword] = useState('');
  const [validPassword,setValidPassword] = useState(false);
  const [roles,setRoles] = useState(['Employee']);

  //effects
  useEffect(() => {
    setValidUsername( USER_REGEX.test(username) );
  }, [username]);

  useEffect(() => {
    setValidPassword( PWD_REGEX.test(password) );
  }, [password]);

  useEffect(() => {
    if(isSuccess){
      setUsername('');
      setPassword('');
      setRoles([]);
      navigate('/dash/users');
    }
  }, [isSuccess, navigate]);
  
  //handlers
  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);
  const onRolesChanged = e => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  }

  const canSave = [roles.length, validUsername,validPassword].every(Boolean) && !isLoading;
  
  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if(canSave) await addNewUser({ username, password, roles })
  }

  //conditional styles
  const errClass = isError ? 'errmsg' : 'offscreen';
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : '';

  //option setting for dropdown menu
  const options = Object.values(ROLES).map(role => (
    <option key={role} value={role}>{role}</option>
  ));

  const content = (
    <>
      <p className={ errClass }>{ error?.data?.message }</p>
    
      <form className='form' onSubmit={ onSaveUserClicked }>
        {/* title */}
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button
              className='icon-button'
              title='Save'
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={ faSave }/>
            </button>
          </div>
        </div>
        {/* username */}
        <label className='form__lable' htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          type='text'
          id='username'
          name='username'
          className={`form__input ${validUserClass}`}
          autoComplete='off'
          value={ username }
          onChange={ onUsernameChanged }
        />
        {/* password */}
        <label className='form__lable' htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          type='text'
          id='password'
          name='password'
          className={`form__input ${validPwdClass}`}
          value={ password }
          onChange={ onPasswordChanged }
        />
        {/* roles */}
        <label className='form__lable' htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select 
          name="roles" 
          id="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size='3'
          value={ roles }
          onChange={ onRolesChanged }
        >
          { options }
        </select>
      </form>
    </>
  );
  return content
}

export default NewUserForm