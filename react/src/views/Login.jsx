import React, { use, useRef } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axios-client';


import { useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();
  const onSubmit = (ev) => {
    ev.preventDefault()
    const payload = {
    
      email: emailRef.current.value,
      password: passwordRef.current.value,
      
    };
   setErrors(null);
    axiosClient.post('/login', payload)
      .then(({ data }) => { //actual response is in data which is returned from the server 
        setUser(data.user);
        setToken(data.token);
        navigate('/users'); // redirect to users page
      })
      .catch(err => {
        console.log(err);
        const response = err.response; //response from the server in case of error
        if (response && response.status === 422) {  //422 is validation error
          if (response.data.errors) {
            setErrors(response.data.errors);
          }else {
          setErrors({
            email: [response.data.message]
          });
        }
      }
      });
  }
  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className='form'>
        <form onSubmit={onSubmit}>
          <h1 className='title'> Login into your account</h1>
           {errors && (
            <div className='alert'>
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={emailRef} type='email'placeholder="Email" />
          <input ref={passwordRef} type='password' placeholder="Password" />
          <button className='btn btn-block'>Login</button>
          <p className='message'>
            Not registered yet? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
      
    </div>
  )
}
