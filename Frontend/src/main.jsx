import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { initializeApiInterceptors } from "./services/api.js";

// InterceptorInitializer no longer calls useAuth hook directly
const InterceptorInitializer = ({ setAppError }) => {
  React.useEffect(() => {
    initializeApiInterceptors(null, setAppError);
  }, [setAppError]);
  return null;
};

const Root = () => {
  const [appError, setAppError] = React.useState(null);

  return (
    <Router>
      <AuthProvider>
        <InterceptorInitializer setAppError={setAppError} />
        <App />
      </AuthProvider>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
