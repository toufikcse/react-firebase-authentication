import './App.css';
import initializeAuthentication from './Firebase/firebase.init';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';

initializeAuthentication();

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logIn, setLogIn] = useState(false);
  
  const auth = getAuth();

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const toggleLogIn = e => {
    setLogIn(e.target.checked);
  }

  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if(password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    if(!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password should be at least two uppercase letters');
      return;
    }

    logIn ? loginEnter(email, password) : registrationEnter(email, password);
  }

  const registrationEnter = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      verifyEmail();
      setError('');
      setUserName();
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(result => {

    })
  }

  const loginEnter = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      setError('');
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(result => {
      console.log(result);
    })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
    .then(result => {
      // console.log(result);
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const handleNameChange = e => {
    setName(e.target.value);
  }

  return (
    <div>
      <form onSubmit={handleRegistration} className="m-5 ">
        <h3>Please {logIn ? 'Log In' : 'Registration'}</h3>
        {!logIn && <div className="mb-3">
          <label htmlFor="exampleInputName" className="form-label">Name</label>
          <input onBlur={handleNameChange} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" required/>
        </div>}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
          <input onBlur={handleEmailChange} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input onBlur={handlePasswordChange} type="password" className="form-control" id="exampleInputPassword1" required/>
        </div>
        <div className="mb-3 text-danger">{error}</div>
        <div className="mb-3 form-check">
          <input onChange={toggleLogIn} type="checkbox" className="form-check-input" id="exampleCheck1"/>
          <label className="form-check-label" htmlFor="exampleCheck1">Already Registered?</label>
        </div>
        <button type="submit" className="btn btn-primary">{logIn ? 'Log in' : 'Register'}</button>
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm">Reset Password</button>
      </form>
    </div>
  );
}

export default App;
