import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Eye, 
  MapPin, 
  Clock, 
  Home, 
  Phone,
  ArrowLeft,
  Share2,
  Printer,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Tag,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { postService } from '../services/postService';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      
      if (response.success) {
        setArticle(response.post);
        
        // Récupérer TOUS les articles pour les filtrer côté client
        const allResponse = await postService.getAllPosts();
        if (allResponse.success) {
          const filtered = allResponse.posts
            .filter(p => 
              p._id !== response.post._id && 
              p.status === 'publié' && 
              p.isPublished === true &&
              p.category === response.post.category
            )
            .slice(0, 3);
          setRelatedArticles(filtered);
        }
      } else {
        setError('Article non trouvé');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger l\'article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    
    if (imageData.thumbnailBase64) {
      let base64Data = imageData.thumbnailBase64;
      if (!base64Data.startsWith('data:')) {
        base64Data = `data:${imageData.mimetype || 'image/jpeg'};base64,${base64Data}`;
      }
      return base64Data;
    }
    
    if (imageData.base64) {
      let base64Data = imageData.base64;
      if (!base64Data.startsWith('data:')) {
        base64Data = `data:${imageData.mimetype || 'image/jpeg'};base64,${base64Data}`;
      }
      return base64Data;
    }
    
    return null;
  };

  const nextImage = () => {
    if (article.images && article.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % article.images.length);
    }
  };

  const prevImage = () => {
    if (article.images && article.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? article.images.length - 1 : prev - 1
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.content?.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erreur de partage:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Lien copié dans le presse-papier'))
        .catch(() => alert('Impossible de copier le lien'));
    }
  };

  // Fonction pour formater le contenu avec des paragraphes
  const formatContent = (content) => {
    if (!content) return [];
    
    // Séparer par les retours à la ligne
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    // Si pas de paragraphes clairs, utiliser les retours simples
    if (paragraphs.length <= 1) {
      return content.split('\n').filter(p => p.trim());
    }
    
    return paragraphs;
  };

  // Calculer le temps de lecture
  const calculateReadTime = (content) => {
    if (!content) return '1 min';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200); // 200 mots par minute
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-5xl text-red-500 mb-4">!</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Article non trouvé</h2>
            <p className="text-gray-600 mb-8">{error || "Cet article n'existe pas ou a été supprimé."}</p>
            <Link
              to="/actualites"
              className="inline-flex items-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#004488] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux actualités
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isEvent = article.type === 'événement';
  const currentImage = article.images?.[currentImageIndex];
  const imageUrl = currentImage ? getImageUrl(currentImage) : null;
  const contentParagraphs = formatContent(article.content);
  const readTime = calculateReadTime(article.content);
  const wordCount = article.content?.split(' ').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Bouton retour */}
      <div className="bg-white border-b border-gray-200  shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <button
            onClick={() => navigate('/actualites')}
            className="inline-flex mt-12 items-center gap-2 text-[#003366] hover:text-[#004488] font-medium group"
          >
            <ArrowLeft className="w-5  h-5 group-hover:-translate-x-1 transition-transform" />
            Retour aux actualités
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête détaillé */}
        <div className="mb-8 bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                isEvent 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                  : 'bg-gradient-to-r from-[#003366] to-[#004488] text-white'
              }`}>
                {isEvent ? '🎪 Événement' : '📰 ' + (article.category || 'Actualité')}
              </span>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{formatDate(article.publishDate || article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{article.viewCount || 0} vues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">{readTime} de lecture</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Résumé */}
          {article.content && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border-l-4 border-[#003366]">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-[#003366] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Résumé</p>
                  <p className="text-gray-700">
                    {article.content.substring(0, 200)}...
                    <button 
                      onClick={() => setShowFullContent(!showFullContent)}
                      className="ml-2 text-[#003366] hover:text-[#004488] font-medium"
                    >
                      {showFullContent ? 'Voir moins' : 'Lire la suite'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Auteur */}
          {article.author && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#004488] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {article.author.prenom?.[0]}{article.author.nom?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    {article.author.prenom} {article.author.nom}
                  </p>
                  {article.author.role && (
                    <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block mt-1">
                      {article.author.role}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Publié le</p>
                <p className="font-medium text-gray-800">
                  {formatDate(article.publishDate || article.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section événement */}
        {isEvent && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              Détails de l'événement
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {article.eventDate && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg mb-1">Date et heure</p>
                      <p className="text-gray-900 text-xl font-bold">
                        {formatDate(article.eventDate)}
                      </p>
                      {article.eventTime && (
                        <p className="text-gray-700 flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{formatTime(article.eventTime)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {article.eventLocation && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg mb-1">Lieu</p>
                      <p className="text-gray-900 text-xl font-bold">{article.eventLocation}</p>
                      {article.eventAddress && (
                        <p className="text-gray-600 mt-2 flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          {article.eventAddress}
                        </p>
                      )}
                      {article.eventCity && (
                        <p className="text-gray-500 text-sm mt-1">{article.eventCity}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {article.eventContact && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg mb-1">Contact et informations</p>
                      <p className="text-gray-900 text-lg">{article.eventContact}</p>
                      <p className="text-gray-600 mt-3">
                        Pour plus d'informations ou pour confirmer votre présence, veuillez contacter l'organisateur.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Galerie d'images */}
        {article.images && article.images.length > 0 && (
          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
              {imageUrl ? (
                <img 
                  src={imageUrl}
                  alt={`${article.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-[500px] object-contain bg-white"
                />
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#0055AA]">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-xl">Image non disponible</p>
                  </div>
                </div>
              )}
              
              {/* Navigation images */}
              {article.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Indicateurs */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                    {article.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white w-8' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Compteur */}
                  <div className="absolute top-6 right-6 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {article.images.length}
                  </div>
                </>
              )}
            </div>
            
            {/* Légende */}
            {currentImage && currentImage.originalName && (
              <div className="mt-4 bg-white p-4 rounded-xl shadow-sm">
                <p className="text-center text-gray-700 font-medium">
                  {currentImage.originalName}
                  {currentImage.size && (
                    <span className="text-gray-500 ml-3">
                      ({(currentImage.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contenu détaillé */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#003366]" />
                Contenu détaillé
              </h2>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Temps de lecture : {readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{wordCount} mots</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{contentParagraphs.length} sections</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              {showFullContent ? (
                // Contenu complet
                <div className="space-y-6">
                  {contentParagraphs.map((paragraph, index) => (
                    <div key={index} className="mb-6">
                      {paragraph.length > 100 ? (
                        <>
                          <p className="text-gray-800 leading-relaxed text-lg mb-4">
                            {paragraph}
                          </p>
                          {index < contentParagraphs.length - 1 && (
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-700 leading-relaxed text-lg mb-4">
                          {paragraph}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // Extrait
                <div className="space-y-6">
                  {contentParagraphs.slice(0, 3).map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed text-lg">
                      {index === 2 && paragraph.length > 200 
                        ? `${paragraph.substring(0, 200)}...` 
                        : paragraph}
                    </p>
                  ))}
                  
                  {contentParagraphs.length > 3 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-blue-100">
                      <div className="text-center">
                        <p className="text-gray-700 mb-4">
                          Cet article contient {contentParagraphs.length - 3} sections supplémentaires.
                        </p>
                        <button
                          onClick={() => setShowFullContent(true)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#003366] to-[#004488] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
                        >
                          <ExternalLink className="w-5 h-5" />
                          Lire la suite ({readTime} restantes)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Bouton pour réduire */}
              {showFullContent && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowFullContent(false)}
                    className="inline-flex items-center gap-2 text-[#003366] hover:text-[#004488] font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Revenir à l'aperçu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Tag className="w-6 h-6 text-[#003366]" />
              Mots-clés et sujets
            </h3>
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-xl text-sm font-semibold border border-gray-200 hover:border-[#003366] hover:bg-blue-50 transition-all shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-4">
              {article.tags.length} mot{article.tags.length > 1 ? 's' : ''}-clé{article.tags.length > 1 ? 's' : ''} associé{article.tags.length > 1 ? 's' : ''} à cet article
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mb-12 bg-gradient-to-r from-[#003366]/5 to-[#004488]/5 rounded-2xl p-8 border border-[#003366]/10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Partager cet article</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleShare}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#003366] to-[#004488] text-white rounded-xl hover:shadow-xl transition-all hover:scale-[1.02] font-semibold"
            >
              <Share2 className="w-6 h-6" />
              Partager sur les réseaux
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-800 rounded-xl border-2 border-gray-300 hover:border-[#003366] hover:bg-gray-50 transition-all font-semibold"
            >
              <Printer className="w-6 h-6" />
              Imprimer l'article
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Partagez cet article pour diffuser l'information
          </p>
        </div>

        {/* Articles similaires */}
        {relatedArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Articles similaires
              </h2>
              <Link 
                to="/actualites"
                className="text-[#003366] hover:text-[#004488] font-semibold flex items-center gap-2"
              >
                Voir tout
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <div key={related._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200">
                  <Link to={`/actualites/${related._id}`} className="block">
                    {/* Image miniature */}
                    <div className="h-48 relative overflow-hidden">
                      {related.images?.[0]?.thumbnailBase64 ? (
                        <img 
                          src={`data:${related.images[0].mimetype || 'image/jpeg'};base64,${related.images[0].thumbnailBase64}`}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#0055AA]">
                          <FileText className="w-12 h-12 text-white/70" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#003366] transition-colors">
                        {related.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span className="font-medium">
                          {formatDate(related.publishDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {related.viewCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          related.type === 'événement'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {related.type === 'événement' ? 'Événement' : 'Actualité'}
                        </span>
                        <span className="text-[#003366] font-semibold text-sm group-hover:underline">
                          Lire →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations de publication */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-800 mb-1">Informations de publication</p>
              <p>
                Publié le {formatDate(article.publishDate || article.createdAt)} • 
                Dernière mise à jour le {formatDate(article.updatedAt || article.createdAt)} • 
                Statut: <span className="font-semibold text-green-600">Publié</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800 mb-1">Référence</p>
              <p className="text-xs font-mono bg-gray-100 px-3 py-1 rounded">
                ID: {article._id.substring(0, 8)}...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;