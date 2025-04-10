import { seed } from './seed';  // Assure-toi que le chemin est correct

console.log("Début du script de runSeed");

seed().then(() => {
  console.log("Base de données initialisée avec succès");
}).catch((error) => {
  console.error("Erreur dans l'exécution de seed:", error);
});
