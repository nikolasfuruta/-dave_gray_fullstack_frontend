import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Layout from './components/public/Layout';
import Public from './components/public/Public';
import Login from './features/auth/Login';
import PrivateLayout from './components/private/PrivateLayout';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import EditNote from './features/notes/EditNote';
import NewNoteForm from './features/notes/NewNoteForm';
import Prefetch from './features/auth/Prefetch';

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={ <Layout/> }>
        {/*start public routes*/}
        <Route index element={ <Public/> }/>
        <Route path='login' element={ <Login/> }/>
        {/*end public routes*/}

        {/*start protected routes*/}
        <Route element={ <Prefetch/> }>
          <Route path='dash' element={ <PrivateLayout/> }>
            <Route index element={ <Welcome/> }/>
            {/*start notes routes*/}
            <Route path='notes'>
              <Route index element={ <NotesList/> }/>
              <Route path=':id' element={ <EditNote/> }/>
              <Route path='new' element={ <NewNoteForm/> }/>
            </Route>
            {/*end notes routes*/}

            {/*start users routes*/}
            <Route path='users'>
              <Route index element={ <UsersList/> }/>
              <Route path=':id' element={ <EditUser/> }/>
              <Route path='new' element={ <NewUserForm/> }/>
            </Route>
            {/*end users routes*/}
          </Route>
        </Route>
        {/*end protected routes*/}
      </Route>
    </Routes>
  )
}

export default App