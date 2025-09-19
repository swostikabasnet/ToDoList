import React, { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStateContext } from '../Contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function DefaultLayout() {
  const { user, token, notification, setUser, setToken } = useStateContext();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post('/logout').then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get('/user').then(({ data }) => {
      setUser(data);
    });
  }, [setUser]);

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
      </aside>

      <div className="content">
        {notification && <div className="notification">{notification}</div>}

        <header className="flex items-center px-6 py-4 bg-white shadow relative">
          {/* Show TODOLIST only on /dashboard */}
          {location.pathname === "/dashboard" && (
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
              TO-DO-LIST
            </h1>
          )}

          {/* Logout always on the right */}
          <a
            href="#"
            onClick={onLogout}
            className="btn-logout ml-auto text-red-500 font-semibold"
          >
            Logout
          </a>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
