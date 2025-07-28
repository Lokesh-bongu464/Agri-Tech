import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Using localStorage (persist after refresh)
    const storedToken = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        logout();
      }
    }
    setAuthLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    setGlobalError(null);
    try {
      let response;
      if (userType === "user") {
        response = await api.post("/users/login", { email, password });
      } else if (userType === "admin") {
        response = await api.post("/admin/login", { email, password });
      } else {
        throw new Error("Invalid user type for login.");
      }

      const {
        token: newToken,
        user: userData,
        admin: adminData,
      } = response.data;
      const currentUser = userData || adminData;

      setToken(newToken);
      setUser(currentUser);

      // Store in localStorage for persistence
      localStorage.setItem("jwtToken", newToken);
      localStorage.setItem("user", JSON.stringify(currentUser));

      if (currentUser.role === "admin") {
        navigate("/ahome");
      } else {
        navigate("/uhome");
      }
      return { success: true, message: response.data.message };
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      setGlobalError(errMsg);
      console.error("Login failed:", errMsg);
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/ulogin");
    setGlobalError(null);
  };

  // Expose this setter so InterceptorInitializer can display errors
  const setAppError = (errorMessage) => {
    setGlobalError(errorMessage);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        globalError,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",
        login,
        logout,
        setAppError, // Exposed here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
