import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Contexts/ContextProvider';
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';

export default function Tasks() {
  const { token, setNotification } = useStateContext();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    project_id: '',
    assigned_user_id: ''
  });

  useEffect(() => {
    if (token) {
      getTasks();
      getProjects();
    }
  }, [token, filters]);

  const getTasks = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });

    axiosClient.get(`/tasks?${params.toString()}`)
      .then(({ data }) => {
        setLoading(false);
        setTasks(data.data);
      })
      .catch(() => {
        setLoading(false);
        setTasks([]);
      });
  };

  const getProjects = () => {
    axiosClient.get('/projects')
      .then(({ data }) => {
        setProjects(data.data);
      });
  };

  const onDelete = (task) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    axiosClient.delete(`/tasks/${task.id}`)
      .then(() => {
        setNotification('Task was successfully deleted');
        getTasks();
      });
  };

  const updateTaskStatus = (task, newStatus) => {
    axiosClient.put(`/tasks/${task.id}`, { ...task, status: newStatus })
      .then(() => {
        setNotification('Task status updated');
        getTasks();
      });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link className="btn-add" to="/tasks/new">Add new task</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            value={filters.status} 
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select 
            value={filters.project_id} 
            onChange={e => setFilters({...filters, project_id: e.target.value})}
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>

          <button onClick={() => setFilters({ status: '', project_id: '', assigned_user_id: '' })}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan="8" className="text-center">Loading...</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.project?.name}</td>
                  <td>{task.assigned_user?.name || 'Unassigned'}</td>
                  <td>
                    <select 
                      value={task.status} 
                      onChange={e => updateTaskStatus(task, e.target.value)}
                      className={`status ${task.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <span className={`priority ${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                  <td>
                    <Link className="btn-edit" to={'/tasks/' + task.id}>Edit</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={() => onDelete(task)}>Delete</button>
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