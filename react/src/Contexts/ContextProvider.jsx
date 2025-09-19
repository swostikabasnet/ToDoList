import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({}); // initialState can be an object with user details or null
  const [notification, _setNotification] = useState('');
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN')); // token is null when user is not authenticated
  const setNotification = (msg) => {
    _setNotification(msg);
    setTimeout(() => {
      _setNotification('');
    }, 5000); // Clear notification after 3 seconds
  }

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notification,
        setNotification,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext); // custom hook to use the context in any component
