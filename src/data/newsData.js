import tem1 from '../assets/images/tem1.jpeg';
import tem2 from '../assets/images/tem2.jpeg';

export const newsData = [
  {
    id: 1,
    slug: "grande-mobilisation-parakou-2025",
    title: "Grande Mobilisation à Parakou",
    description: "Plus de 400 personnes à Parakou Bastion de l’opposition",
    fullContent: `
      <h2>Une mobilisation historique à Parakou</h2>
      <p>Le Mouvement Patriotique du Bénin a organisé une grande mobilisation à Parakou le 29 novembre 2025, rassemblant plus de 400 personnes dans ce bastion traditionnel de l'opposition.</p>
      
      <h3>Un événement marquant</h3>
      <p>La mobilisation s'est déroulée dans le quartier Arafat, où les membres et sympathisants du mouvement se sont rassemblés pour écouter les orientations du leadership.</p>
      
      <p>Les thèmes principaux abordés étaient :</p>
      <ul>
        <li>L'engagement citoyen pour le développement</li>
        <li>La participation des jeunes en politique</li>
        <li>Les projets communautaires prioritaires</li>
      </ul>
      
      <h3>Témoignages des participants</h3>
      <p>"C'est la première fois qu'un mouvement nous parle aussi directement de nos préoccupations" - Jean, étudiant.</p>
      <p>"Nous voyons enfin une alternative crédible pour notre région" - Amina, commerçante.</p>
    `,
    date: "29 Novembre 2025",
    location: "Parakou, Quartier Arafat",
    category: "Événement",
    image: tem1,
    gallery: [
      tem1,
      // Ajoutez d'autres images si disponibles
    ],
    author: "Équipe Communication MPB",
    views: 1245,
    tags: ["Mobilisation", "Parakou", "Jeunesse", "Événement"]
  },
  {
    id: 2,
    slug: "formation-jeunes-leaders-cotonou-2025",
    title: "Formation des Jeunes Leaders",
    description: "Grande mobilisation de jeunes à Cotonou",
    fullContent: `
      <h2>Formation Intensive des Jeunes Leaders</h2>
      <p>Le 15 novembre 2025, le Mouvement Patriotique du Bénin a organisé une session de formation spéciale pour les jeunes leaders à Cotonou.</p>
      
      <h3>Objectifs de la formation</h3>
      <p>Cette formation visait à :</p>
      <ul>
        <li>Renforcer les capacités de leadership des jeunes</li>
        <li>Développer des compétences en communication politique</li>
        <li>Préparer la relève pour les responsabilités futures</li>
      </ul>
      
      <h3>Modules de formation</h3>
      <p>Les participants ont suivi plusieurs modules :</p>
      <ol>
        <li>Leadership et gestion d'équipe</li>
        <li>Communication persuasive</li>
        <li>Stratégie d'organisation communautaire</li>
        <li>Planification de projets sociaux</li>
      </ol>
      
      <h3>Partenaires</h3>
      <p>Cette formation a été réalisée avec le soutien de plusieurs organisations locales et internationales spécialisées dans le développement du leadership.</p>
      
      <p><strong>Prochaine session :</strong> Janvier 2026 à Porto-Novo</p>
    `,
    date: "15 Novembre 2025",
    location: "Cotonou, Quartier Gbégamey",
    category: "Campagne",
    image: tem2,
    gallery: [
      tem2,
    ],
    author: "Département Formation MPB",
    views: 987,
    tags: ["Formation", "Jeunesse", "Leadership", "Cotonou"]
  },
  // Ajoutez plus d'articles ici
];

// Catégories disponibles
export const categories = [
  "Événement",
  "Campagne", 
  "Communiqué",
  "Formation",
  "Projet",
  "Initiative"
];

// Fonction pour récupérer un article par slug
export const getArticleBySlug = (slug) => {
  return newsData.find(article => article.slug === slug);
};

// Fonction pour récupérer les articles par catégorie
export const getArticlesByCategory = (category) => {
  return newsData.filter(article => article.category === category);
};