import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import tem1 from '../assets/images/tem1.jpeg';
import tem2 from '../assets/images/tem2.jpeg';
import { Link } from 'react-router-dom';

const NewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const news = [
    {
      id: 1,
      title: "Grande Mobilisation à Parakou",
      description: "Plus de 400 personnes à Parakou Bastion de l’opposition",
      date: "29 Novembre 2025",
      location: "Parakou, Quartier Arafat",
      category: "Événement",
      image: tem1
    },
    {
      id: 2,
      title: "Formation des Jeunes Leaders",
      description: "Grande mobilisation de jeunes à Cotonou",
      date: "15 Novembre 2025",
      location: "Cotonou, Quartier Gbégamey",
      category: "Campagne",
      image: tem2
    },/*
    {
      id: 3,
      title: "Forum de l'Innovation",
      description: "Rencontre des entrepreneurs innovants",
      date: "30 Janvier 2024",
      location: "Cotonou",
      category: "Économie",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800"
    }
    */
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [news.length]);

  return (
    <section id="actualites" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#003366] mb-4">
            Actualités du mouvement
          </h2>
          <p className="text-gray-600">
            Les dernières activités du mouvement
          </p>
        </div>

        {/* Carousel simple */}
        <div className="mb-12">
          <div className="relative rounded-lg overflow-hidden shadow-md">
            <div className="h-80 md:h-96">
              <img 
                src={news[currentSlide].image}
                alt={news[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-white/20 px-3 py-1 rounded text-sm">
                    {news[currentSlide].category}
                  </span>
                  <span className="text-sm">{news[currentSlide].date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {news[currentSlide].title}
                </h3>
                <p className="text-white/90">
                  {news[currentSlide].description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full ${
                  index === currentSlide ? 'w-8 bg-[#003366]' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Liste des news */}
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-semibold text-[#003366]">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                <h4 className="font-bold text-lg text-[#003366] mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>
                  <Link 
                    to={`/actualites/${item.slug}`}
                    className="text-[#003366] hover:text-[#0055AA] text-sm font-semibold"
                  >
                    Lire plus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;