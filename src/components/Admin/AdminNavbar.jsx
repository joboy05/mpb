// Remplacer tout le composant AdminNavbar.jsx par :

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Search, Settings, Bell, UserCog, Mail, LogOut,
  Home, Users, Calendar, FileText
} from 'lucide-react';

const AdminNavbar = ({ admin, searchQuery, setSearchQuery, handleSearch, handleLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#003366] to-[#004488] shadow-xl border-b border-[#FFD700]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFAA00] rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-[#003366]" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">MPB Admin</h1>
                <p className="text-xs text-[#FFD700]/80">Mouvement Patriotique du Bénin</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              <Link to="/admin/dashboard" className="text-white border-[#FFD700] inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium bg-[#0055AA]/30 rounded-t-lg">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/admin/membres" className="text-[#CCDDFF] hover:text-white hover:border-[#FFD700]/50 inline-flex items-center px-4 py-2 border-b-2 border-transparent hover:border-b-2 text-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                Membres
              </Link>
              <Link to="/admin/posts" className="text-[#CCDDFF] hover:text-white hover:border-[#FFD700]/50 inline-flex items-center px-4 py-2 border-b-2 border-transparent hover:border-b-2 text-sm font-medium">
                <Calendar className="w-4 h-4 mr-2" />
                Publications
              </Link>
              {/*<Link to="/admin/rapports" className="text-[#CCDDFF] hover:text-white hover:border-[#FFD700]/50 inline-flex items-center px-4 py-2 border-b-2 border-transparent hover:border-b-2 text-sm font-medium">
                <FileText className="w-4 h-4 mr-2" />
                Rapports
              </Link>*/}
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Recherche */}
            <form onSubmit={handleSearch} className="hidden md:block mr-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#FFD700]/70" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un membre..."
                  className="block w-64 pl-10 pr-3 py-2 border border-[#FFD700]/30 rounded-lg leading-5 bg-[#002244]/50 placeholder-[#CCDDFF]/70 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] text-white text-sm backdrop-blur-sm"
                />
              </div>
            </form>
            
            {/* Admin info */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="text-right mr-3 hidden md:block">
                  <p className="text-sm font-medium text-white">
                    {admin?.prenom} {admin?.nom}
                  </p>
                  <p className="text-xs text-[#FFD700]/80">Administrateur</p>
                </div>
                <div 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFAA00] rounded-full flex items-center justify-center text-[#003366] font-bold cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300"
                >
                  {admin?.prenom?.charAt(0)}{admin?.nom?.charAt(0)}
                </div>
                
                {/* Menu déroulant - click */}
                <div className="ml-3 relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex text-sm rounded-full focus:outline-none"
                  >
                    <Settings className="h-5 w-5 text-[#FFD700] hover:text-white transition-colors" />
                  </button>
                  
                  {/* Menu déroulant */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      
                      <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-gradient-to-b from-[#003366] to-[#004488] border border-[#FFD700]/30 ring-1 ring-black ring-opacity-5 z-20 backdrop-blur-md">
                        <div className="py-2">
                          <Link 
                            to="/admin/profile" 
                            className="flex items-center px-4 py-3 text-sm text-white hover:bg-[#0055AA]/50 hover:text-[#FFD700] transition-all duration-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <UserCog className="w-4 h-4 mr-2" />
                            Mon profil
                          </Link>
                          {/*<Link 
                            to="/admin/notifications" 
                            className="flex items-center px-4 py-3 text-sm text-white hover:bg-[#0055AA]/50 hover:text-[#FFD700] transition-all duration-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            Notifications
                          </Link>
                          <Link 
                            to="/admin/messages" 
                            className="flex items-center px-4 py-3 text-sm text-white hover:bg-[#0055AA]/50 hover:text-[#FFD700] transition-all duration-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Messages
                          </Link>*/}
                          <hr className="my-2 border-[#FFD700]/20" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-[#0055AA]/50 hover:text-red-100 transition-all duration-300"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;