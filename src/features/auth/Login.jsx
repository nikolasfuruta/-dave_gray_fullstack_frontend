import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

const Login = () => {
  //hooks
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  //rtk
  const [login, { isLoading }] = useLoginMutation();

  //effect
  useEffect(() => {
    userRef.current.focus()
  }, []);

  useEffect(() => {
    setErrMsg('')
  }, [username, password]);

  //err class
  const errClass = errMsg ? 'errmsg' : 'offscreen'

  //handlers
  const handleUserInput = e => setUsername(e.target.value);
  const handlePwdInput = e => setPassword(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash');
    }
    catch(err){
      if(!err.originalStatus) setErrMsg('No Server Response');
      else if (err.originalStatus === 400) setErrMsg('Missing Username or Password');
      else if (err.originalStatus === 401) setErrMsg('Unauthorized');
      else setErrMsg(err?.data?.message);
      errRef.current.focus();
    }
  }

  //check loading
  if(isLoading) return <p>Loading...</p>

  //content
  const content = (
    <section className='public'>
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={ errRef } className={ errClass } aria-live='assertive'>
          { errMsg }
        </p>
        <form onSubmit={ handleSubmit } className="form">
          {/* username */}
          <label htmlFor="username">Username:</label>
          <input
            id='username'
            type='text'
            className='form__input'
            ref={ userRef }
            value={ username }
            onChange={ handleUserInput }
            autoComplete='off'
            required
          />
          {/* pwd */}
          <label htmlFor="password">Password:</label>
          <input
            id='password'
            type='password'
            className='form__input'
            value={ password }
            onChange={ handlePwdInput }
            required
          />
          <button className="form__submit-button">Sign In</button>
        </form>
      </main>
      <footer>
        <Link to='/'>Back to Home</Link>
      </footer>
    </section>
  );

  return content;
}

export default Login