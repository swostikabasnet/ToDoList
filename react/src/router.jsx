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
import { RouterProvider } from "react-router-dom";
import UserForm from "./views/UserForm.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> }, 
      { path: "users", element: <Users /> }, 
      { path: "projects", element: <Projects /> }, 
      { path: "tasks", element: <Tasks /> }, 
      { path: "users/new", element: <UserForm key="userCreate"/> },  
      { path: "users/:id", element: <UserForm key="userUpdate"/> },
      
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