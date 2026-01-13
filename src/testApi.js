import { authAPI } from './api/auth';

const testAPI = async () => {
  console.log('🧪 Test de l\'API MPB...');
  
  try {
    // Test d'inscription
    console.log('1. Test d\'inscription...');
    const registerData = {
      nom: 'Test',
      prenom: 'Frontend',
      email: 'frontend.test@example.com',
      phoneCode: '+229',
      telephone: '01020304',
      birthYear: 1992,
      pays: 'Bénin',
      department: 'Littoral',
      commune: 'Cotonou',
      profession: 'Développeur',
      disponibilite: 'Quelques heures par semaine',
      motivation: 'Je veux tester l\'intégration frontend-backend avec une longue motivation',
      password: 'test12345'
    };
    
    const registerResult = await authAPI.register(registerData);
    console.log('✅ Inscription:', registerResult.success ? 'Succès' : 'Échec');
    
    if (registerResult.success) {
      // Test de connexion
      console.log('2. Test de connexion...');
      const loginResult = await authAPI.login({
        identifier: 'frontend.test@example.com',
        password: 'test12345',
        loginType: 'email'
      });
      
      console.log('✅ Connexion:', loginResult.success ? 'Succès' : 'Échec');
      
      if (loginResult.success) {
        console.log('🎉 Token JWT reçu:', loginResult.token.substring(0, 50) + '...');
        console.log('👤 Membre:', loginResult.member);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

export default testAPI;