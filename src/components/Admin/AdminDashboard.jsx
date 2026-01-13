import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, memberService } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import MembersTable from './MembersTable';
import QuickActions from './QuickActions';
import DashboardFooter from './DashboardFooter';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentMember = authService.getCurrentMember();
    
    if (!currentMember) {
      navigate('/login');
      return;
    }
    
    if (currentMember.role !== 'admin') {
      alert('Accès réservé aux administrateurs');
      navigate('/carte-membre');
      return;
    }
    
    setAdmin(currentMember);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const membersData = await memberService.getAllMembers();
      setMembers(membersData.members || []);
      
      const totalMembers = membersData.members?.length || 0;
      const activeMembers = membersData.members?.filter(m => m.isActive !== false).length || 0;
      
      setStats({
        totalMembers,
        activeMembers,
        inactiveMembers: totalMembers - activeMembers,
        admins: membersData.members?.filter(m => m.role === 'admin').length || 0,
        recentRegistrations: membersData.members?.slice(0, 5).length || 0
      });
      
    } catch (error) {
      console.error('Erreur dashboard:', error);
      alert('Erreur de chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      authService.logout();
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  const filteredMembers = members.filter(member => 
    searchQuery === '' ||
    member.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.membershipNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003366]/5 via-[#004488]/5 to-[#003366]/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366]/5 via-[#004488]/5 to-[#003366]/5 backdrop-blur-sm">
      <AdminNavbar 
        admin={admin}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        <StatsCards stats={stats} />
        <MembersTable 
          members={members}
          searchQuery={searchQuery}
          filteredMembers={filteredMembers}
        />
        <QuickActions />
      </main>

      <DashboardFooter />
    </div>
  );
};

export default AdminDashboard;