import React, { use, useEffect } from 'react';
import { Link, Navigate,Outlet} from 'react-router-dom';
import { useStateContext } from '../Contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function DefaultLayout() {
  const { user, token,notification, setUser, setToken } = useStateContext();
  if (!token) {
    return <Navigate to="/login" />; // if no token, redirect to login
  }

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post('/logout')
    .then(()=>{
      setUser({})
      setToken(null)
    })
   
  };
  
  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUser(data)
      })
  })

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
      </aside>
      <div className='content'>
        {notification &&
        <div className='notification'>
          {notification}
        </div>
        }
        
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800">TODOLIST</h1>
            </div>
            <div>
              <a href="#" onClick={onLogout} className="btn-logout">Logout</a>  
            </div>   
        </header>
            <main>
                <Outlet /> {/* This is where the child routes will be rendered */}
        </main>
        </div>
      {/* <div>
        {user && user.name ? `Welcome, ${user.name}` : ''}
        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
      </div> */}
    </div>
  )
};



