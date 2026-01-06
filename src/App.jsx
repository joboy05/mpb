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
// Créez un composant LoginPage ou supprimez cette route si vous ne l'avez pas encore
// import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rejoindre" element={<JoinMovement />} />
        <Route path="/verify-member" element={<VerifyMember />} />
        <Route path="/carte-membre" element={<MemberCard />} />
        <Route path="/actualites" element={<NewsList />} />
        <Route path="/actualites/:slug" element={<NewsDetail />} />
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