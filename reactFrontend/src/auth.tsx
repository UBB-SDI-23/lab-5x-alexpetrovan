import React, { createContext, useState, ReactNode } from "react";
import axios from "axios";
import { BACKEND_API_URL } from "./constants";
import { useNavigate } from "react-router-dom";


// Define the shape of the context value
interface AuthContextValue {
  loggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with initial values
const AuthContext = createContext<AuthContextValue>({
    loggedIn: false,
    login: () => Promise.resolve(),
    logout: () => {},
});

// Custom hook to access the context
export const useAuth = () => React.useContext(AuthContext);

// Create the AuthProvider component to provide the context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // Define the login and logout functions
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${BACKEND_API_URL}/token/`, {
        username: username,
        password: password,
      });
      const token = response.data.access;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setLoggedIn(true);
    } catch (error) {
      throw new Error("Login failed"); // Handle the error appropriately
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedIn(false);
    navigate("/login");
  };

  // Provide the context value to the children components
  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

