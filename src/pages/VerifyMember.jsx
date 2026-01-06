// VerifyMember.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Shield, Home } from 'lucide-react';
import Navbar from '../components/Navbar';

const VerifyMember = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [memberInfo, setMemberInfo] = useState(null);

  useEffect(() => {
    const memberId = searchParams.get('memberId');
    const name = searchParams.get('name');
    const number = searchParams.get('number');

    // Simulation de vérification
    setTimeout(() => {
      if (memberId && name && number) {
        setVerificationStatus('valid');
        setMemberInfo({
          name: decodeURIComponent(name),
          membershipNumber: number,
          status: 'Actif',
          joinDate: '2024-01-15',
          expirationDate: '2025-01-15'
        });
      } else {
        setVerificationStatus('invalid');
      }
    }, 1500);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-20 px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#003366]"></div>
            <Shield className="w-12 h-12 text-[#003366]" />
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#003366]"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6">
            Vérification de Membre
          </h1>
          
          <p className="text-lg text-gray-600">
            Vérification de l'authenticité de la carte de membre
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {verificationStatus === 'loading' ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003366] mx-auto mb-6"></div>
              <p className="text-gray-600">Vérification en cours...</p>
            </div>
          ) : verificationStatus === 'valid' ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-green-600 mb-6">
                Carte Authentique ✓
              </h2>
              
              <div className="max-w-md mx-auto space-y-6 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-[#003366] mb-4 text-lg">Informations du Membre</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-green-100">
                      <span className="text-gray-600">Nom complet</span>
                      <span className="font-semibold text-[#003366]">{memberInfo.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-green-100">
                      <span className="text-gray-600">Numéro de membre</span>
                      <span className="font-semibold text-[#003366]">{memberInfo.membershipNumber}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-green-100">
                      <span className="text-gray-600">Statut</span>
                      <span className="font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        {memberInfo.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Validité</span>
                      <span className="font-semibold text-[#003366]">
                        {memberInfo.joinDate} - {memberInfo.expirationDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8">
                Ce membre est officiellement inscrit au Mouvement Patriotique du Bénin.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-red-600 mb-6">
                Carte Invalide ✗
              </h2>
              
              <p className="text-gray-600 mb-8">
                Cette carte de membre n'a pas pu être vérifiée. 
                Veuillez contacter l'administration du Mouvement Patriotique du Bénin pour plus d'informations.
              </p>
            </div>
          )}
          
          <div className="text-center pt-8 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#003366] to-[#004488] text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMember;