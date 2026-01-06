// NewsDetail.jsx - VERSION CORRIGÉE SANS react-icons
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Eye, 
  Printer,
  Facebook,
  Twitter,
  MessageCircle // Utilisez MessageCircle au lieu de Whatsapp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getArticleBySlug, newsData } from '../data/newsData';

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const foundArticle = getArticleBySlug(slug);
    if (!foundArticle) {
      navigate('/actualites');
      return;
    }
    
    setArticle(foundArticle);
    
    // Trouver des articles similaires
    const related = newsData
      .filter(a => a.id !== foundArticle.id && a.category === foundArticle.category)
      .slice(0, 3);
    setRelatedArticles(related);
    
    document.title = `${foundArticle.title} - Mouvement Patriotique du Bénin`;
  }, [slug, navigate]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `Lisez cet article : ${article.title}`;

  const handleShare = (platform) => {
    let url;
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-20 px-4 py-8">
        {/* Bouton retour */}
        <div className="mb-8">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 text-[#003366] hover:text-[#0055AA] font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux actualités
          </Link>
        </div>

        {/* En-tête de l'article */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gradient-to-r from-[#003366] to-[#0055AA] text-white px-4 py-2 rounded-lg font-medium">
              {article.category}
            </span>
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{article.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views} vues</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{article.author}</div>
                <div className="text-sm text-gray-500">Auteur</div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                title="Partager sur Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-10 h-10 bg-blue-50 text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                title="Partager sur Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                title="Partager sur WhatsApp"
              >
                <MessageCircle className="w-5 h-5" /> {/* MessageCircle au lieu de Whatsapp */}
              </button>
              <button
                onClick={handlePrint}
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Imprimer"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Image principale */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Contenu de l'article */}
        <article className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.fullContent }} />
        </article>

        {/* Tags */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Mots-clés :</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Articles similaires */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-[#003366] mb-8">
              Articles similaires
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link
                  key={related.id}
                  to={`/actualites/${related.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="h-48">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-semibold text-[#003366]">
                        {related.category}
                      </span>
                      <span className="text-sm text-gray-500">{related.date}</span>
                    </div>
                    <h4 className="font-bold text-lg text-[#003366] mb-2 group-hover:text-[#0055AA] transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#003366] mb-4">
              Vous souhaitez nous soutenir ?
            </h3>
            <p className="text-gray-700 mb-6">
              Rejoignez le Mouvement Patriotique du Bénin et contribuez au développement de notre nation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rejoindre"
                className="bg-gradient-to-r from-[#003366] to-[#0055AA] text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
              >
                Devenir membre
              </Link>
              <Link
                to="/actualites"
                className="bg-white text-[#003366] border-2 border-[#003366] px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Voir plus d'articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;