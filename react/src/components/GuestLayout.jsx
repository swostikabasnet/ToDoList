import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useStateContext } from '../Contexts/ContextProvider';

// the child routes need to be rendered inside the layout(outlet)
export default function GuestLayout() {
    const { token } = useStateContext();
    if (token) {
        return <Navigate to="/" />; //if token exists, redirect to dashboard
    }
  return (
    <div>
      <Outlet />
    </div>
  )
}
