// Home.jsx - Version mise à jour
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ValuesSection from '../components/ValuesSection';
import AboutSection from '../components/AboutSection';
import Vision from '../components/Vision';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsSection from '../components/NewsSection';
import DocumentsSection from '../components/DocumentsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <Vision />
      <TestimonialsSection />
      <ValuesSection />
      <DocumentsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;