import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_projects: 0,
    total_tasks: 0,
    tasks_per_project: [],
  });

  useEffect(() => {
    axiosClient.get('/dashboard-stats')
      .then(({ data }) => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard-cards">
      <div className="card">
        <h2>{stats.total_users}</h2>
        <p>Total Users</p>
      </div>
      <div className="card">
        <h2>{stats.total_projects}</h2>
        <p>Total Projects</p>
      </div>
      <div className="card">
        <h2>{stats.total_tasks}</h2>
        <p>Total Tasks</p>
      </div>

      <div className="project-task-list">
        <h3>Tasks per Project</h3>
        <ul>
          {stats.tasks_per_project.map(project => (
            <li key={project.id}>
              {project.name}: {project.tasks_count} tasks
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}