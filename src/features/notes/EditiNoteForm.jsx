import React, { useState,useEffect } from 'react';
import { useUpdateNoteMutation, useDeleteNoteMutation } from './noteApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';


const EditiNoteForm = ({ note, users }) => {
  const navigate = useNavigate();

  //hooks
  const [updateNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateNoteMutation();

  const [deleteNote, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError
  }] = useDeleteNoteMutation();

  //states
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [userId, setUserId] = useState(note.user);
  const [completed, setCompleted] = useState(note.completed);

  //effect
  useEffect(() => {
    if(isSuccess || isDelSuccess) {
      setTitle('');
      setText('');
      setCompleted('')
      setUserId('');
      navigate('/dash/notes');
    }
  }, [isSuccess, isDelSuccess, navigate]);

  //handlers
  const onTitleChanged = e => setTitle(e.target.value);
  const onTextChanged = e => setText(e.target.value);
  const onUserIdChanged = e => setUserId(e.target.value);
  const onCompletedChanged = e => setCompleted(prev => !prev);

    //enable save
    const canSave = [title,text,userId].every(Boolean) && !isLoading;

  const onNoteSaveClicked = async (e) => {
    e.preventDefault();
    if(canSave) {
      await updateNote({id: note.id, user: userId, title, text, completed});
    }
  }

  const onDeleteNoteClicked = async (e) => {
    e.preventDefault();
    await deleteNote({ id: note.id })
  }

  //conditional styles
  const errClass = isError ? 'errmsg' : 'offscreen';
  const validTitleClass = !title ? 'form__input--incomplete' : '';
  const validTextClass = !text ? 'form__input--incomplete' : '';
  
  //option setting for dropdown menu
  const options = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  //timestaps
  const createdAt = new Date(note.createdAt).toLocaleString('pt-BR', { day:'numeric', month:'long', year:'numeric', hour:'numeric', minute:'numeric',second:'numeric' });
  const updatedAt = new Date(note.updatedAt).toLocaleString('pt-BR', { day:'numeric', month:'long', year:'numeric', hour:'numeric', minute:'numeric',second:'numeric' });

  //err content
  const errContent = (error?.data?.message || delError?.data?.message) ?? '';


  const content = (
    <>
      <p className={ errClass }>{ errContent }</p>

      <form className="form">
        <div className="form__title-row">
          <h2>Edit Note #{ note.ticket }</h2>
          <div className="form__action-buttons">
            {/* update btn */}
            <button
              className='icon-button'
              title='Save'
              disabled={ !canSave }
              onClick={ onNoteSaveClicked }
            >
              <FontAwesomeIcon icon={ faSave }/>
            </button>
            {/* delete btn */}
            <button
              className='icon-button'
              title='Delete'
              onClick={ onDeleteNoteClicked }
            >
              <FontAwesomeIcon icon={ faTrashCan }/>
            </button>
          </div>
        </div>
      {/* title */}
      <label className='form__label' htmlFor="title">
        Title:
      </label>
      <input
        id='title'
        name='title'
        type='text'
        autoComplete='off'
        className={ `form__input ${ validTitleClass }` }
        value={ title }
        onChange={ onTitleChanged }
      />
      {/* text*/}
      <label className='form__label' htmlFor="text">
        Text:
      </label>
      <textarea
        id='text'
        name='text'
        className={ `form__input form__input--text ${ validTextClass }` }
        value={ text }
        onChange={ onTextChanged }
      />

      <div className="form__row">
        <div className="form__divider">
          {/*completed*/}
          <label className='form__label form__checkbox-container' htmlFor="complete">
            WORK COMPLETE:
          </label>
          <input
            id='complete'
            name='complete'
            type='checkbox'
            className={ `form__checkbox` }
            checked={ completed }
            onChange={ onCompletedChanged }
          />
          {/*userId*/}
          <label className='form__label form__checkbox-container' htmlFor="user">
            ASSIGNED TO:
          </label>
          <select 
            name="user" 
            id="user"
            className={ `form__select` }
            value={ userId }
            onChange={ onUserIdChanged }
          >
            <option value=''></option>
            { options }
          </select>
        </div>
        <div className="form__divider">
          <p className="form__created">Created:<br/>{ createdAt }</p>
          <p className="form__updated">Updated:<br/>{ updatedAt }</p>
        </div>
      </div>
      </form>
    </>
  );

  return content;
}

export default EditiNoteForm;