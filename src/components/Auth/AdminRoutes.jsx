import { Navigate } from 'react-router-dom';
import { authService } from '../../services/api';

const AdminRoute = ({ children }) => {
  // Vérifier si l'utilisateur est connecté ET est admin
  const token = localStorage.getItem('mpb_token');
  const member = authService.getCurrentMember();
  
  if (!token || !member) {
    // Rediriger vers la page de connexion
    return <Navigate to="/login" />;
  }
  
  if (member.role !== 'admin') {
    // Rediriger vers la page membre normale
    alert('Accès réservé aux administrateurs');
    return <Navigate to="/carte-membre" />;
  }
  
  return children;
};

export default AdminRoute;