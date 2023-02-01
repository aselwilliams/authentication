import classes from './ProfileForm.module.css';
import { useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import {useHistory} from 'react-router-dom'

const ProfileForm = () => {
const history = useHistory()

  const authCtx = useContext(AuthContext)
  const newPasswordRef = useRef()

  const handleSubmit = (e)=> {
    e.preventDefault();

    const newPassword = newPasswordRef.current.value;
    //add validation
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBAVhqqsq4dJTWcmF7rMZkr50iWeXcrG-A', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: newPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content=Type': 'application/json'
      }
    }).then((res)=> {
      //assumption always succees
      history.replace('/')
    })
  }
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
