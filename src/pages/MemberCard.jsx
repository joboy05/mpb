// MemberCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Download, Share2, Home, User, Calendar, MapPin, Shield, QrCode, Printer, Mail, Phone, Award } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import html2canvas from 'html2canvas';

const MemberCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [memberData, setMemberData] = useState(null);
  const [qrData, setQrData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Récupérer les données du membre depuis le localStorage ou la navigation
    const data = location.state?.memberData || JSON.parse(localStorage.getItem('mpb_member'));
    
    if (!data) {
      navigate('/rejoindre');
      return;
    }

    setMemberData(data);
    
    // Générer les données pour le QR Code (URL de la page du membre)
    const baseUrl = window.location.origin;
// Remplacer la ligne 48-50 par :
// Dans useEffect, modifiez :
const qrContent = `${baseUrl}/verify-member?data=${btoa(JSON.stringify({
  id: data.memberId,
  name: `${data.nom} ${data.prenom}`,
  number: data.membershipNumber,
  status: data.status,
  permanent: true,
  commune: data.commune,
  joinDate: data.dateInscription
}))}`;
    setQrData(qrContent);
  }, [location, navigate]);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `Carte-MPB-${memberData.membershipNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      alert('Carte téléchargée avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL('image/png');
      
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `Carte-MPB-${memberData.membershipNumber}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `Ma carte de membre - Mouvement Patriotique du Bénin`,
          text: `Je suis maintenant membre officiel du Mouvement Patriotique du Bénin ! 🎉`,
          files: [file]
        });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Share
        navigator.clipboard.writeText(`Je suis membre du Mouvement Patriotique du Bénin ! Mon numéro de membre: ${memberData.membershipNumber}`);
        alert('Lien copié dans le presse-papier !');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  if (!memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre carte de membre...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto mt-20 px-4 py-12">
        {/* En-tête de confirmation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <div className="relative">
              <Award className="w-12 h-12 text-[#003366]" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Bienvenue Membre !
          </h1>
          
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-[#003366] to-yellow-400 mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Félicitations ! Vous êtes maintenant membre officiel du Mouvement Patriotique du Bénin
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Statut : Actif ✓</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Carte de membre - Version téléchargeable */}
          <div className="space-y-8">
            <div ref={cardRef} className="relative bg-gradient-to-br from-[#003366] via-[#004488] to-[#003366] rounded-3xl shadow-2xl p-8 text-white overflow-hidden min-h-[600px]">
              {/* Décorations */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full translate-x-32 translate-y-32"></div>
              
              {/* Motifs décoratifs */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-32 h-32 border-2 border-yellow-400/30 rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-32 h-32 border-2 border-yellow-400/30 rounded-full"></div>
              </div>

              {/* Contenu de la carte */}
              <div className="relative z-10 h-full flex flex-col">
                {/* En-tête de la carte */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm font-medium text-yellow-400 mb-1">CARTE DE MEMBRE</div>
                      <div className="text-2xl font-bold">Mouvement Patriotique</div>
                      <div className="text-lg text-white/80">du Bénin</div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="h-1 w-full bg-gradient-to-r from-yellow-400 to-transparent"></div>
                </div>

                {/* Informations du membre */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <User className="w-8 h-8 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white/70">Nom complet</div>
                        <div className="text-xl font-bold">{memberData.nom} {memberData.prenom}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-white/70 mb-1">Numéro de membre</div>
                        <div className="text-lg font-bold text-yellow-400">{memberData.membershipNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70 mb-1">Date d'adhésion</div>
                        <div className="text-lg font-bold">{memberData.subscriptionDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-sm text-white/70">Localisation</div>
                        <div className="text-lg">{memberData.commune}, {memberData.pays}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-sm text-white/70">Validité</div>
                        <div className="text-lg">{memberData.subscriptionDate} - {memberData.expirationDate}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code et footer */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white/70 mb-2">QR Code d'identification</div>
                      <div className="text-xs text-white/50">Scannez pour vérifier l'authenticité</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg">
                      <QRCodeSVG 
                        value={qrData}
                        size={80}
                        level="H"
                        includeMargin
                        bgColor="#FFFFFF"
                        fgColor="#003366"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center text-xs text-white/60">
                    Cette carte est la propriété exclusive du Mouvement Patriotique du Bénin
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDownloadCard}
                disabled={isGenerating}
                className="group bg-gradient-to-r from-[#003366] to-[#004488] text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>{isGenerating ? 'Génération...' : 'Télécharger la carte'}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#003366] py-4 rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>
          </div>

          {/* Section informations et next steps */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#003366] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-lg flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                Vos prochaines étapes
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 group hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Vérifiez votre email</h3>
                    <p className="text-gray-600 text-sm">
                      Un email de confirmation a été envoyé à <strong>{memberData.email}</strong> avec votre kit de bienvenue
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 group hover:bg-yellow-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Télécharger l'application</h3>
                    <p className="text-gray-600 text-sm">
                      Téléchargez notre application mobile pour accéder à toutes les fonctionnalités membres
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100 group hover:bg-green-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Premier événement</h3>
                    <p className="text-gray-600 text-sm">
                      Participez à notre prochain webinaire d'accueil des nouveaux membres
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#003366] to-[#0055AA] rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <QRCodeSVG  className="w-6 h-6" />
                Comment utiliser votre QR Code
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Accès aux événements</h4>
                    <p className="text-white/80 text-sm">Présentez votre QR Code pour accéder gratuitement à tous nos événements</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Vérification d'identité</h4>
                    <p className="text-white/80 text-sm">Votre QR Code permet de vérifier votre statut de membre en ligne</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Avantages spéciaux</h4>
                    <p className="text-white/80 text-sm">Profitez de réductions chez nos partenaires avec votre QR Code</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-gray-200">
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#003366] px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;