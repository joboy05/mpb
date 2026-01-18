import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { authService } from '../services/api';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await authService.verifyEmail(token);
                setStatus('success');
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Lien invalide ou expiré');
            }
        };

        if (token) {
            verify();
        } else {
            setStatus('error');
            setMessage('Lien de vérification manquant');
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {status === 'loading' && (
                    <>
                        <Loader className="w-16 h-16 text-[#003366] animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-[#003366] mb-2">Vérification en cours...</h2>
                        <p className="text-gray-600">Veuillez patienter pendant que nous validons votre email.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-[#003366] mb-2">Email Vérifié !</h2>
                        <p className="text-gray-600 mb-8">Votre compte est activé. Vous pouvez maintenant vous connecter.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-[#003366] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                            Se connecter
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Échec de la vérification</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
                        >
                            Retour à la connexion
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
