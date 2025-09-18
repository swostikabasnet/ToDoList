import React, { useRef, useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';

export default function SignUp() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const ConfirmpasswordRef = useRef();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const { setUser, setToken } = useStateContext();

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: ConfirmpasswordRef.current.value,
    };
    console.log(payload);
    axiosClient.post('/signup', payload)
      .then(({ data }) => { //actual response is in data which is returned from the server 
        setUser(data.user);
        setToken(data.token);
        navigate('/users'); // redirect to users page
      })
      .catch(err => {
        console.log(err);
        const response = err.response; //response from the server in case of error
        if (response && response.status === 422) {  //422 is validation error
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className='form'>
        <form onSubmit={onSubmit}>
          <h1 className='title'>SignUp</h1>
          {errors && (
            <div className='alert'>
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={nameRef} placeholder="Name" />
          <input ref={emailRef} type="email" placeholder="Email Address" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input ref={ConfirmpasswordRef} type="password" placeholder="Confirm Password" />
          <button className='btn btn-block'>SignUp</button>
          <p className='message'>
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}