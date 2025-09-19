import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function Dashboard() {
  const { user, token } = useStateContext();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (token) {
      axiosClient.get('/user')
        .then(({ data }) => {
          setUserInfo(data);
        })
        .catch(() => {
          setUserInfo(null);
        });
    }
  }, [token]);

  return (
    <div className="dashboard">
      
      {userInfo ? (
        <div>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
