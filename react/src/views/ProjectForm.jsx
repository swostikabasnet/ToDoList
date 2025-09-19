import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../Contexts/ContextProvider.jsx";

export default function ProjectForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [project, setProject] = useState({
    id: null,
    name: '',
    description: '',
    status: 'active',
    user_ids: []
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient.get(`/projects/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProject({
            ...data,
            user_ids: data.users?.map(user => user.id) || []
          });
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  useEffect(() => {
    // Load all users for assignment
    axiosClient.get('/users')
      .then(({ data }) => {
        setUsers(data.data);
      });
  }, []);

  const onSubmit = ev => {
    ev.preventDefault();
    
    if (project.id) {
      axiosClient.put(`/projects/${project.id}`, project)
        .then(() => {
          setNotification('Project was successfully updated');
          navigate('/projects');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/projects', project)
        .then(() => {
          setNotification('Project was successfully created');
          navigate('/projects');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const handleUserToggle = (userId) => {
    const currentUsers = project.user_ids || [];
    if (currentUsers.includes(userId)) {
      setProject({
        ...project,
        user_ids: currentUsers.filter(id => id !== userId)
      });
    } else {
      setProject({
        ...project,
        user_ids: [...currentUsers, userId]
      });
    }
  };

  return (
    <>
      {project.id && <h1>Update Project: {project.name}</h1>}
      {!project.id && <h1>New Project</h1>}
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
              value={project.name} 
              onChange={ev => setProject({...project, name: ev.target.value})} 
              placeholder="Project Name" 
            />
            <textarea 
              value={project.description} 
              onChange={ev => setProject({...project, description: ev.target.value})} 
              placeholder="Project Description" 
              rows="4"
            />
            <select 
              value={project.status} 
              onChange={ev => setProject({...project, status: ev.target.value})}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
            
            <div className="user-assignment">
              <h3>Assign Users:</h3>
              {users.map(user => (
                <label key={user.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={project.user_ids?.includes(user.id) || false}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  {user.name} ({user.email})
                </label>
              ))}
            </div>
            
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
