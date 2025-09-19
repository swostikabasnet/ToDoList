import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { token } = useStateContext();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (token) {
      axiosClient.get('/projects') 
        .then(({ data }) => {
          setProjects(data);
        })
        .catch(() => {
          setProjects([]);
        });
    }
  }, [token]);

  return (
    <div className="projects">
      <h1>Projects</h1>
      {projects.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Assigned Users</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.assigned_users.map(u => u.name).join(', ')}</td>
                <td>{project.created_at}</td>
                <td>
                  {/* Add Edit/Delete buttons here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
}