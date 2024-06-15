import { Navigate } from "react-router-dom"
import { useAuth } from '../context/authContext';
import Spinner from './Spinner'; 

export const ProtectedRoute = ({ children, redirectTo = "/auth" }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />; // Mostrar el Spinner en lugar de la palabra "Loading"

  if (!user) {
    return <Navigate to={redirectTo} />
  }
  return children;
};






