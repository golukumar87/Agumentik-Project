import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? <Navigate to="/" replace /> : children;
};

const StartRoute = () => {
  const { token } = useSelector((state) => state.auth);
  return token ? <DashboardPage /> : <WelcomePage />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StartRoute />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
