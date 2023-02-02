import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Layout from './components/public/Layout';
import Public from './components/public/Public';
import Login from './features/auth/Login';
import PrivateLayout from './components/private/PrivateLayout';
import Welcome from './features/auth/Welcome';
import NotesList from './features/notes/NotesList';
import UsersList from './features/users/UsersList';

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={ <Layout/> }>
        {/*start public routes*/}
        <Route index element={ <Public/> }/>
        <Route path='login' element={ <Login/> }/>
        {/*end public routes*/}

        {/*start protected routes*/}
        <Route path='dash' element={ <PrivateLayout/> }>
          <Route index element={ <Welcome/> }/>
          {/*start notes routes*/}
          <Route path='notes'>
            <Route index element={ <NotesList/> }/>
          </Route>
          {/*end notes routes*/}

          {/*start users routes*/}
          <Route path='users'>
            <Route index element={ <UsersList/> }/>
          </Route>
          {/*end users routes*/}
        </Route>
        {/*end protected routes*/}
      </Route>
    </Routes>
  )
}

export default App