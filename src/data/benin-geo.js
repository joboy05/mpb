// data/benin-geo.js
// Départements et communes du Bénin

export const beninDepartments = [
  {
    id: "atacora",
    name: "Atacora",
    communes: [
      "Natitingou", "Tanguiéta", "Kouandé", "Kérou", "Matéri", 
      "Cobly", "Boukoumbé", "Toucountouna", "Péhunco"
    ]
  },
  {
    id: "atlantique",
    name: "Atlantique",
    communes: [
      "Cotonou", "Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", 
      "Sô-Ava", "Toffo", "Tori-Bossito", "Zè"
    ]
  },
  {
    id: "borgou",
    name: "Borgou",
    communes: [
      "Parakou", "Bembèrèkè", "Kalalé", "N'Dali", "Nikki", 
      "Pèrèrè", "Sinendé", "Tchaourou"
    ]
  },
  {
    id: "collines",
    name: "Collines",
    communes: [
      "Dassa-Zoumè", "Glazoué", "Ouèssè", "Savè", "Savalou", 
      "Bantè"
    ]
  },
  {
    id: "couffo",
    name: "Couffo",
    communes: [
      "Aplahoué", "Djakotomey", "Klouékanmè", "Lalo", "Toviklin", 
      "Dogbo"
    ]
  },
  {
    id: "donga",
    name: "Donga",
    communes: [
      "Djougou", "Bassila", "Copargo", "Ouaké"
    ]
  },
  {
    id: "littoral",
    name: "Littoral",
    communes: [
      "Cotonou"
    ]
  },
  {
    id: "mono",
    name: "Mono",
    communes: [
      "Lokossa", "Athémè", "Bopa", "Comè", "Grand-Popo", 
      "Houéyogbé"
    ]
  },
  {
    id: "oueme",
    name: "Ouémé",
    communes: [
      "Porto-Novo", "Adjohoun", "Aguégués", "Akpro-Missérété", "Avrankou", 
      "Bonou", "Dangbo", "Sèmè-Podji", "Adjarra"
    ]
  },
  {
    id: "plateau",
    name: "Plateau",
    communes: [
      "Sakété", "Adja-Ouèrè", "Ifangni", "Kétou", "Pobè"
    ]
  },
  {
    id: "zou",
    name: "Zou",
    communes: [
      "Abomey", "Agbangnizoun", "Bohicon", "Covè", "Djidja", 
      "Ouinhi", "Za-Kpota", "Zangnanado", "Zogbodomey"
    ]
  },
  {
    id: "alibori",
    name: "Alibori",
    communes: [
      "Kandi", "Banikoara", "Gogounou", "Kérou", "Malanville", 
      "Ségbana", "Karimama"
    ]
  }
];

// Fonction pour obtenir les communes d'un département
export const getCommunesByDepartment = (departmentName) => {
  const department = beninDepartments.find(dept => 
    dept.name.toLowerCase() === departmentName.toLowerCase()
  );
  return department ? department.communes : [];
};

// Fonction pour obtenir tous les départements
export const getAllDepartments = () => {
  return beninDepartments.map(dept => dept.name);
};