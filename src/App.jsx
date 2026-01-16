import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import JoinMovement from './pages/JoinMovement';
import VerifyMember from './pages/VerifyMember';
import MemberCard from './pages/MemberCard';
import NotFound404 from './pages/NotFound404';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import RegisterPage from './pages/RegisterPage';
import CompleteProfile from './pages/users/CompleteProfile';
import Profil from './pages/users/Profile';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoutes';
import AdminDashboard from './pages/admin/Dashboard';
import CreateContent from './pages/admin/CreateContent';
import UserDashboard from './pages/users/Dashboard';
import ManagePosts from './pages/admin/ManagePost';
import EditContent from './pages/admin/EditContent';
import Membres from './pages/admin/Membres';
import ArticleDetail from './pages/ArticleDetail';
import AdminProfile from './pages/admin/AdminProfile';

// Créez un composant LoginPage ou supprimez cette route si vous ne l'avez pas encore
// import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<JoinMovement />} />
        <Route path="/rejoindre" element={<JoinMovement />} />
        <Route path="/profile/complete" element={<CompleteProfile />} />
        <Route path="/verify-member" element={<VerifyMember />} />
        <Route path="/actualites" element={<NewsList />} />
        {/* <Route path="/actualites/:slug" element={<NewsDetail />} /> */}
        <Route path="/actualites/:id" element={<ArticleDetail />} />
        <Route path="/users/dashboard" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/mon-profil" element={
          <PrivateRoute>
            <Profil />
          </PrivateRoute>
        } />
        <Route path="/carte-membre" element={
          <PrivateRoute>
            <MemberCard />
          </PrivateRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/profile" element={
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        } />
        
        {/* Autres routes admin (à créer plus tard) */}
        <Route path="/admin/membres" element={
          <AdminRoute>
            <Membres />
          </AdminRoute>
        } />
        <Route path="/admin/evenements" element={
          <AdminRoute>
            <CreateContent />
          </AdminRoute>
        } />
        <Route path="/admin/posts" element={
          <AdminRoute>
            <ManagePosts />
          </AdminRoute>
        } />
        <Route path="/admin/content/edit/:id" element={
          <AdminRoute>
            <EditContent />
          </AdminRoute>
        } />
<Route path="/profil" element={
  <PrivateRoute>
    {/* <Profil /> */}
  </PrivateRoute>
} />
        <Route path="*" element={<NotFound404 />} />
        {/* Vous pouvez ajouter d'autres routes ici plus tard */}
        {/* <Route path="/about" element={<About />} />
           <Route path="/news" element={<NewsPage />} />
           <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;