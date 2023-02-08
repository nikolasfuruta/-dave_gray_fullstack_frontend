import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectAllUsers } from '../users/userApiSlice';
import EditiNoteForm from './EditiNoteForm';
import { selectNoteById } from './noteApiSlice';


const EditNote = () => {
  const { id } = useParams();

  const note = useSelector(state => selectNoteById(state,id));
  const users = useSelector(selectAllUsers);

  const content = note && users 
    ? <EditiNoteForm note={note} users={users}/>
    : <p>Loading...</p>
  
  return content;
}

export default EditNote