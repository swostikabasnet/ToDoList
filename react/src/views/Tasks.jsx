import React, { use, useEffect } from 'react';
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';

export default function Users() {
  const[users,setUsers]=React.useState([]);
  const[loading,setLoading]=React.useState(false);
  const{setNotification}= useStateContext();

  useEffect(()=>{
    getUsers();
  },[]);

  const onDelete=(u)=>{
    if(!window.confirm("Are you sure you want to delete this user?")){
      return
    }

  }
  const getUsers= ()=>{
    setLoading(true);
      axiosClient.get('/users')
      .then(({data})=>{
        setLoading(false);
        setUsers(data.data)

      })
  
  .catch(()=>{
    setLoading(false);
  });
  };
  
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Tasks</h1>
        <Link to="/users/new" className='btn-add'>Add new task</Link>
      </div>
      <div className='card animated fadeInDown'>
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Assigned user</th>
              <th>Status</th>
            </tr>
          </thead>
          {loading && <tbody>
            <tr>
              <td colSpan="5"className='text-center'>
                Loading...
              </td>
            </tr>
          </tbody>
          }
          {/* {!loading && <tbody>
           {users.map(u=>(
            <tr>
              <td>
                <Link className='btn-edit' to={'/users/'+u.id}>Edit</Link>
                &nbsp;
                <button onClick= {ev=> onDelete(u)}className='btn-delete'>Delete</button>
              </td>
              </tr>
            ))}
          </tbody>
          } */}
        </table>
      </div>
    </div>
    
  )
}
