import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import axiosClient from '../axios-client';

export default function Tasks() {
  const { token } = useStateContext();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (token) {
      axiosClient.get('/tasks')
        .then(({ data }) => {
          setTasks(data);
        })
        .catch(() => {
          setTasks([]);
        });
    }
  }, [token]);

  return (
    <div className="tasks">
      <h1>Tasks</h1>
      {tasks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Assigned users</th>
              <th>Status</th>
              <th>Due Date</th>
              
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.project?.name}</td>
                <td>{task.status}</td>
                <td>{task.due_date}</td>
                <td>
                  {/* Add Edit/Delete buttons here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}