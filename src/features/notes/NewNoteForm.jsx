import React, { useState, useEffect } from 'react';
import { useAddNewNoteMutation } from './noteApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const NewNoteForm = ({ users }) => {
  const navigate = useNavigate();

  //hooks
  const [addNewNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewNoteMutation();

  //states
  const [userId, setUserId] = useState(users[0].id);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  //effect
  useEffect(() => {
    if(isSuccess) {
      setTitle('');
      setText('');
      setUserId('');
      navigate('/dash/notes');
    }
  },[isSuccess, navigate]);

  //handlers
  const canSave = [userId, title, text].every(Boolean) && !isLoading;
  const onUserIdChanged = e => setUserId(e.target.value);
  const onTitleChanged = e => setTitle(e.target.value);
  const onTextChanged = e => setText(e.target.value);
  const onSaveNoteClicked = async e => {
    e.preventDefault();
    if(canSave) await addNewNote({ user: userId, title, text });
  }

    //conditional styles
    const errClass = isError ? 'errmsg' : 'offscreen';
    const validTitleClass = !title ? 'form__input--incomplete' : '';
    const validTextClass = !title ? 'form__input--incomplete' : '';


    //option setting for dropdown menu
  const options = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  const content = (
    <>
      <p className={ errClass }>{ error?.data?.message }</p>

      <form onSubmit={ onSaveNoteClicked } className="form">
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className='form__action-buttons'>
            <button
              title='Save'
              className='icon-button'
              disabled={ !canSave }
            >
              <FontAwesomeIcon icon={ faSave }/>
            </button>
          </div>
        </div>
        {/* title */}
        <label className="form__lable" htmlFor='title'>
          Title:
        </label>
        <input 
          id='title'
          name='title'
          type="text" 
          className={`form__input ${ validTitleClass }`}
          autoComplete='off'
          value={ title }
          onChange={ onTitleChanged }
        />
        {/* text */}
        <label className="form__lable" htmlFor='text'>
          Text:
        </label>
        <textarea
          className={ `form__input form__input--text ${ validTextClass }` }
          id="text" 
          name="text" 
          value={ text }
          onChange={ onTextChanged }
        />
        {/* select user */}
        <label 
          className="form__lable form__checkbox-container" 
          htmlFor='userNAME'
        >
          ASSIGNED TO:
        </label>
        <select
          className='form__select'
          name="username" 
          id="username" 
          value={ userId }
          onChange={ onUserIdChanged }
        >
          <option value=""></option>
          { options }
        </select>
      </form>
    </>
  );

  return content;
}

export default NewNoteForm