import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const TOKEN_KEY = "jwtToken";
const USER_KEY = "user";
const SESSION_KEY = "app_session_id";

// Try to get session ID from sessionStorage first (persists in browser reloads)
if (!sessionStorage.getItem(SESSION_KEY)) {
  // If not there, generate new and store
  sessionStorage.setItem(SESSION_KEY, Date.now().toString());
}
window.__APP_SESSION_ID__ = sessionStorage.getItem(SESSION_KEY);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedSession = localStorage.getItem(SESSION_KEY);
    const currentSession = window.__APP_SESSION_ID__;

    // Only log in if sessions match
    if (storedToken && storedUser && storedSession === currentSession) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid stored user data", err);
        logout(false);
      }
    } else {
      logout(false); // clear stale session
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
        throw new Error("Invalid user type");
      }

      const {
        token: newToken,
        user: userData,
        admin: adminData,
      } = response.data;
      const currentUser = userData || adminData;

      setToken(newToken);
      setUser(currentUser);

      // Save to localStorage for persistence
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      localStorage.setItem(SESSION_KEY, window.__APP_SESSION_ID__);

      navigate(currentUser.role === "admin" ? "/ahome" : "/uhome");

      return { success: true, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed.";
      setGlobalError(msg);
      console.error("Login error:", msg);
      return { success: false, message: msg };
    }
  };

  const logout = (shouldRedirect = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    setGlobalError(null);
    if (shouldRedirect) navigate("/ulogin");
  };

  const setAppError = (message) => setGlobalError(message);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        globalError,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",
        login,
        logout,
        setAppError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
