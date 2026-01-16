import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
IdCard,
  Bell, 
  Calendar, 
  Users, 
  FileText, 
  User, 
  LogOut,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { authAPI } from '../../api/auth';

const Navbar = ({ currentMember }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/users/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { path: '/carte-membre', label: 'Ma carte', icon: <IdCard className="w-4 h-4" /> },
    /*{ path: '/actualites', label: 'Actualités', icon: <FileText className="w-4 h-4" /> },
    { path: '/evenements', label: 'Événements', icon: <Calendar className="w-4 h-4" /> },
    { path: '/membres', label: 'Membres', icon: <Users className="w-4 h-4" /> },*/
  ];

  const adminLinks = currentMember?.role === 'admin' ? [
    { path: '/admin/dashboard', label: 'Admin', icon: <Settings className="w-4 h-4" /> },
  ] : [];

  return (
    <nav className="bg-gradient-to-r from-[#003366] to-[#002244] shadow-2xl border-b border-[#FFD700]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/users/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] via-[#FFB300] to-[#FFD700] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-[#003366] font-bold text-xl">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-xl">MPB</span>
              <p className="text-white/60 text-xs">Mouvement Patriotique</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[...navLinks, ...adminLinks].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Button */}
          <div className="flex items-center gap-4">
            

            {/* User Profile */}
            <Link 
              to="/mon-profil" 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700] via-[#FFB300] to-[#FFD700] text-[#003366] rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{currentMember?.prenom}</span>
            </Link>
            
            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              {[...navLinks, ...adminLinks].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;