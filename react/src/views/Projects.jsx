import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { token, setNotification } = useStateContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      getProjects();
    }
  }, [token]);

  const getProjects = () => {
    setLoading(true);
    axiosClient.get('/projects')
      .then(({ data }) => {
        setLoading(false);
        setProjects(data.data);
      })
      .catch(() => {
        setLoading(false);
        setProjects([]);
      });
  };

  const onDelete = (project) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    axiosClient.delete(`/projects/${project.id}`)
      .then(() => {
        setNotification('Project was successfully deleted');
        getProjects();
      });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link className="btn-add" to="/projects/new">Create new project</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Tasks</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.description || 'No description'}</td>
                  <td>
                    <span className={`status ${project.status}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    {project.completed_tasks_count || 0} / {project.tasks_count || 0}
                  </td>
                  <td>{project.owner?.name}</td>
                  <td>
                    <Link className="btn-edit" to={'/projects/' + project.id}>Edit</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={() => onDelete(project)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}