import React, { useState,useEffect } from 'react';
import { useDeleteUserMutation, useUpdateUserMutation } from './userApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../../config/roles';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const navigate = useNavigate();

  //rtk hooks
  const [ updateUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateUserMutation();

  const [ deleteUser, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError
  }] = useDeleteUserMutation();

  //states
  const [username,setUsername] = useState(user.username);
  const [validUsername,setValidUsername] = useState(false);
  const [password,setPassword] = useState('');
  const [validPassword,setValidPassword] = useState(false);
  const [roles,setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  //effects
  useEffect(() => {
    setValidUsername( USER_REGEX.test(username) );
  }, [username]);

  useEffect(() => {
    setValidPassword( PWD_REGEX.test(password) );
  }, [password]);

  useEffect(() => {
    if(isSuccess || isDelSuccess){
      setUsername('');
      setPassword('');
      setRoles([]);
      navigate('/dash/users');
    }
  }, [isSuccess, isDelSuccess, navigate]);

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
  const onActiveChanged = () => setActive(prev => !prev)
  const onSaveUserClicked = async e => {
    if(password) await updateUser({ id:user.id, username, password, roles, active });
    else await updateUser({ id:user.id, username, roles, active });
  }
  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id })
  }

  let canSave
  password
    ? canSave = [roles.length,validUsername,validPassword].every(Boolean) && !isLoading
    : canSave = [roles.length,validUsername].every(Boolean) && !isLoading

  //conditional styles
  const errClass = isError ? 'errmsg' : 'offscreen';
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = password && !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : '';
  
//err content
  const errContent = (error?.data?.message || delError?.data?.message) ?? '';

  //option setting
  const options = Object.values(ROLES).map(role => (
    <option key={role} value={role}>{role}</option>
  ));

  const content = (
    <>
    <p className={ errClass }>{ errContent }</p>
  
    <form className='form' onSubmit={ e => e.preventDefault() }>
      {/* title */}
      <div className="form__title-row">
        <h2>Edit User</h2>
        <div className="form__action-buttons">
          {/* update btn */}
          <button
            className='icon-button'
            title='Save'
            disabled={!canSave}
            onClick={onSaveUserClicked}
          >
            <FontAwesomeIcon icon={ faSave }/>
          </button>
          {/* delete btn */}
          <button
            className='icon-button'
            title='Delete'
            onClick={onDeleteUserClicked}
          >
            <FontAwesomeIcon icon={ faTrashCan }/>
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
      {/* active */}
      <label className='form__lable' htmlFor="user-active">
        ACTIVE:
      </label>
      <input
        id='user-active'
        name='user-active'
        type='checkbox'
        checked={ active }
        onChange={ onActiveChanged }
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

  return content;
}

export default EditUserForm