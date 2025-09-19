import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../Contexts/ContextProvider.jsx";

export default function TaskForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [task, setTask] = useState({
    id: null,
    name: '',
    description: '',
    project_id: '',
    assigned_user_id: '',
    status: 'Pending',
    priority: 'medium',
    due_date: ''
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient.get(`/tasks/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setTask({
            ...data,
            due_date: data.due_date ? data.due_date.split(' ')[0] : '' // Format for date input
          });
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  useEffect(() => {
    // Load projects and users
    Promise.all([
      axiosClient.get('/projects'),
      axiosClient.get('/users')
    ]).then(([projectsResponse, usersResponse]) => {
      setProjects(projectsResponse.data.data);
      setUsers(usersResponse.data.data);
    });
  }, []);

  const onSubmit = ev => {
    ev.preventDefault();
    
    if (task.id) {
      axiosClient.put(`/tasks/${task.id}`, task)
        .then(() => {
          setNotification('Task was successfully updated');
          navigate('/tasks');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/tasks', task)
        .then(() => {
          setNotification('Task was successfully created');
          navigate('/tasks');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {task.id && <h1>Update Task: {task.name}</h1>}
      {!task.id && <h1>New Task</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input 
              value={task.name} 
              onChange={ev => setTask({...task, name: ev.target.value})} 
              placeholder="Task Name" 
            />
            <textarea 
              value={task.description} 
              onChange={ev => setTask({...task, description: ev.target.value})} 
              placeholder="Task Description" 
              rows="4"
            />
            
            <select 
              value={task.project_id} 
              onChange={ev => setTask({...task, project_id: ev.target.value})}
              required
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            
            <select 
              value={task.assigned_user_id} 
              onChange={ev => setTask({...task, assigned_user_id: ev.target.value})}
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            
            <select 
              value={task.status} 
              onChange={ev => setTask({...task, status: ev.target.value})}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            
            <select 
              value={task.priority} 
              onChange={ev => setTask({...task, priority: ev.target.value})}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <input 
              type="date"
              value={task.due_date} 
              onChange={ev => setTask({...task, due_date: ev.target.value})} 
              placeholder="Due Date" 
            />
            
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}