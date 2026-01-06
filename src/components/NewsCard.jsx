import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, Eye } from 'lucide-react';

const NewsCard = ({ article }) => {
  return (
    <Link
      to={`/actualites/${article.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-[#003366] px-3 py-1 rounded-lg text-sm font-semibold">
            {article.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            <span>{article.views}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#003366] mb-3 group-hover:text-[#0055AA] transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {article.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{article.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#003366] group-hover:text-[#0055AA] transition-colors">
              Lire l'article
            </span>
            <div className="w-5 h-5 bg-[#003366] group-hover:bg-[#0055AA] rounded-full flex items-center justify-center transition-colors">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;