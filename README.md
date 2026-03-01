# Mately Task Manager - Test Stage

Prototype de gestionnaire de tâches collaboratif avec mise à jour en quasi-temps réel, tableau Kanban et simulateur multi-utilisateurs.

## Installation et Lancement

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB tournant localement (URI par défaut : mongodb://127.0.0.1:27017/task_mately)

### Installation
Depuis la racine du projet, lancez la commande suivante pour installer les dépendances du backend et du frontend :
```bash
npm run install-all
```

### Lancement en mode développement
Pour démarrer simultanément le Backend et le Frontend (Web) :
```bash
npm run dev
```
- Backend : http://localhost:3000
- Frontend : http://localhost:8081

### Test sur Mobile (Expo Go)
Pour tester l'application sur un véritable téléphone :
1. Assurez-vous que votre téléphone et votre ordinateur sont sur le **même réseau Wi-Fi**.
2. Identifiez l'adresse IP locale de votre ordinateur (ex: `192.168.1.15`).
3. Modifiez le fichier `front/src/constants/Config.ts` pour remplacer `127.0.0.1` par votre IP locale.
4. Lancez le projet avec `npm run dev`.
5. Ouvrez l'application **Expo Go** sur votre téléphone.
6. Entrez manuellement l'adresse suivante dans le navigateur de votre téléphone ou dans Expo Go : `exp://VOTRE_IP:8081` (ex: `exp://192.168.1.15:8081`).

---

## Logique et Fonctionnalités

### Mise à jour en quasi-temps réel (Polling)
L'application utilise une stratégie de Long Polling pour simuler du temps réel sans la complexité de WebSockets :
- Le frontend conserve l'horodatage (createdAt) de la tâche la plus récente reçue.
- Toutes les 5 secondes, une requête est envoyée au backend demandant uniquement les tâches créées APRÈS cet horodatage.
- Cette méthode évite les transferts de données redondants et permet d'ajouter les nouvelles tâches en haut de la liste sans recharger l'intégralité des données.

### Vues Liste et Tableau (Kanban)
- Vue Liste : Utilise FlatList (optimisé pour la performance) pour afficher toutes les tâches, les plus récentes en premier.
- Vue Tableau : Un layout Kanban responsive qui groupe les tâches par statut (À faire, En cours, Terminé). Sur mobile, cette vue utilise un défilement horizontal avec effet de "snap" pour une expérience native.

### Simulateur de tâches
Le bouton "Simuler" déclenche un processus côté backend qui crée 10 tâches espacées de 5 secondes chacune. Cela permet de vérifier le bon fonctionnement de la mise à jour automatique côté client.

### Architecture
- Backend : Node.js/Express avec Mongoose. Un index a été ajouté sur le champ createdAt pour garantir des performances optimales lors du polling.
- Frontend : React Native (Expo). La logique de synchronisation est isolée dans un hook personnalisé (useTaskPolling), permettant de garder les composants d'interface simples et maintenables.
- CRUD complet : Possibilité de créer manuellement, modifier le statut via un sélecteur dynamique ou supprimer des tâches individuellement.
