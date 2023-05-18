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

  const getUserPageSize = async(username: string): Promise<void> => {
    
    var pageSize: number = 100;

    try {
      const profileResponse = await axios.get(`${BACKEND_API_URL}/User/${username}`);
      
      pageSize = profileResponse.data.page_size;

    } catch(error) {
      throw new Error("Profile was not fetched"); // Handle the error appropriately
    }

    setPageSize(pageSize);

  }


  // Fetch userProfile data and return the pageSize
  const setPageSize = async(pageSize: number): Promise<void> => {
    localStorage.setItem("pageSize", pageSize.toString());
  }

  // Define the login and logout functions
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${BACKEND_API_URL}/token/`, {
        username: username,
        password: password,
      });
      const responseProfile = await axios.get(`${BACKEND_API_URL}/User/${username}/`);
      const role = responseProfile.data.role;
      const token = response.data.access;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      getUserPageSize(username);
      setLoggedIn(true);
    } catch (error) {
      throw new Error("Login failed"); // Handle the error appropriately
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setPageSize(100);
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

