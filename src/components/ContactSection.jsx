// ContactSection.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Star, User, MessageSquare } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous ajouterez la logique d'envoi du formulaire
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphones",
      details: [
        "Bénin: +229 64 19 29 00",
        "France: +33 7 66 89 87 81",
        "Canada: +1 (438) 341 1023"
      ]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["contact@mpb.bj", "info@mpb.bj"]
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Bureaux",
      details: ["Cotonou, Bénin", "Paris, France", "Montréal, Canada"]
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-[#FFD700] rounded-full"></div>
            <div className="w-20 h-px bg-gradient-to-r from-[#FFD700] to-transparent"></div>
            <div className="text-sm font-semibold text-[#003366] uppercase tracking-wider">
              Contactez-Nous
            </div>
            <div className="w-20 h-px bg-gradient-to-l from-[#FFD700] to-transparent"></div>
            <div className="w-3 h-3 bg-[#FFD700] rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6">
            Prenez Contact
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nous sommes à votre écoute pour répondre à vos questions et vous accompagner 
            dans votre engagement citoyen
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#003366] to-[#0055AA] rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                Informations
              </h3>
              
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-white/80 mb-1">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-xl">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#003366] mb-4">
                    Message envoyé avec succès !
                  </h3>
                  <p className="text-gray-600">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-[#003366] mb-6">
                    Envoyez-nous un message
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Votre nom *
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition"
                            placeholder="Jean Dupont"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition"
                            placeholder="+229 00 00 00 00"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition bg-white"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="adhesion">Adhésion au mouvement</option>
                        <option value="information">Demande d'information</option>
                        <option value="partenariat">Proposition de partenariat</option>
                        <option value="evenement">Participation à un événement</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition resize-none"
                        placeholder="Votre message ici..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#003366] to-[#0055AA] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Send className="w-5 h-5" />
                      <span>Envoyer le message</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;