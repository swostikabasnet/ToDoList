import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import SignUp from "./views/SignUp";
import Users from "./views/Users";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Projects from "./views/Projects.jsx";
import Tasks from "./views/Tasks.jsx";
import UserForm from "./views/UserForm.jsx";
import ProjectForm from "./views/ProjectForm.jsx";
import TaskForm from "./views/TaskForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> }, 
      { path: "users", element: <Users /> }, 
      { path: "users/new", element: <UserForm key="userCreate"/> },  
      { path: "users/:id", element: <UserForm key="userUpdate"/> },
      { path: "projects", element: <Projects /> }, 
      { path: "projects/new", element: <ProjectForm key="projectCreate"/> },
      { path: "projects/:id", element: <ProjectForm key="projectUpdate"/> },
      { path: "tasks", element: <Tasks /> }, 
      { path: "tasks/new", element: <TaskForm key="taskCreate"/> },
      { path: "tasks/:id", element: <TaskForm key="taskUpdate"/> },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;