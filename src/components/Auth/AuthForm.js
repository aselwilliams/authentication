import { useState, useRef, useContext} from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom';

const AuthForm = () => {
  const history= useHistory()

  const authCtx = useContext(AuthContext);

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const email= emailRef.current.value;
    const password = passwordRef.current.value;

    //optional:add validation
    setIsLoading(true)
    let url;
    if(isLogin){
      url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBAVhqqsq4dJTWcmF7rMZkr50iWeXcrG-A'
    } else {
      url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBAVhqqsq4dJTWcmF7rMZkr50iWeXcrG-A'
    }
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password:password,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res)=> {
        setIsLoading(false)
          if(res.ok){
            return res.json()
          } else {
            res.json().then((data)=> {
              let errorMessage = 'Authentication failed!';
              // if(data && data.error && data.error.message){
              //   errorMessage = data.error.message
              // }
              alert(errorMessage);
              throw new Error(errorMessage);
            })
          }
      })
      .then((data)=> {
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000))
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/')
      }).catch((err)=> {
        alert(err.message)
      })
    }
  
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
