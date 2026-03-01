# Note de Conception

Ce document détaille ma démarche, mes apprentissages et les choix techniques effectués lors de la réalisation de ce test.

## Un premier pas dans l'écosystème Fullstack JS

Ce projet représente ma toute première expérience concrète avec les technologies suivantes :
- **MongoDB** (Base de données NoSQL)
- **React Native / Expo** (Développement mobile)
- **Node.js / Express** (Développement backend)

Partir de zéro sur ces outils a été un défi enrichissant. J'ai fait le choix délibéré de prendre le temps de comprendre chaque ligne de code et chaque concept (Hooks, architecture API, filtrage de données) plutôt que de viser une perfection superficielle.

## Choix Techniques et Apprentissages

### 1. Synchronisation "Quasi-Temps Réel"
Le sujet demandait une mise à jour fluide des tâches. N'ayant pas encore l'expérience pour implémenter des WebSockets, j'ai opté pour une stratégie de **Long Polling** optimisée :
- **Appris :** L'importance des horodatages (`createdAt`) pour filtrer les données et éviter de surcharger le réseau.
- **Logique :** Le client ne demande que ce qu'il n'a pas déjà, ce qui préserve les performances même avec une mise à jour toutes les 5 secondes.

### 2. Architecture Frontend
J'ai découvert la puissance des **Hooks React** (`useState`, `useEffect`, `useMemo`, `useCallback`). 
- J'ai choisi d'isoler la logique de synchronisation dans un hook personnalisé (`useTaskPolling`). Cela permet de garder le fichier `App.tsx` lisible, concentré uniquement sur l'affichage.

### 3. Responsive Kanban
J'ai implémenté deux vues pour répondre au bonus de tri :
- Une vue liste classique.
- Un tableau Kanban horizontal. J'ai appris à utiliser `useWindowDimensions` pour que l'interface s'adapte automatiquement entre un navigateur web et un écran de téléphone.

## Limites et État du Projet

En raison du temps imparti et de ma volonté de maîtriser ce que je construisais, certains points restent à perfectionner :
- **Stabilité Mobile :** La version mobile via Expo présente encore quelques instabilités de rendu et des incompatibilités de versions de SDK qui ont nécessité des ajustements en cours de route.
- **Gestion d'état :** Pour une application plus large, l'utilisation de Redux ou Context API serait préférable à un passage de props manuel.
- **Design :** L'UI est fonctionnelle, mais les transitions entre les états pourraient être plus fluides avec l'ajout de bibliothèques d'animation.

## Conclusion

Ce test a été une excellente opportunité de monter en compétence sur une stack moderne. J'ai privilégié la compréhension profonde des mécanismes du développement web et mobile à la livraison d'un produit "parfait" mais dont je n'aurais pas maîtrisé la logique. C'est pour moi un projet en cours d'apprentissage, fonctionnel et honnête vis-à-vis de mon parcours actuel.
