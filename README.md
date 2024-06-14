# MMI-VisioConf

**WORK-IN-PROGRESS**

Visio Conf Fullstack-JS webApplication dedicated to MMI Toulon

## Description

Ce projet est une application web de visioconférence développée dans le cadre du projet de la formation MMI de Toulon.
MMI VISIOCONF est développée en fullstack JS avec NodeJS, ExpressJS, Socket.io, MongoDB et ReactJS.
Elle s'inspire grandement des applications de communication telles que Discord ou encore Teams et elle est développée
dans un objectif "open source" et peut être utilisée par n'importe qui.

## Prérequis

- Docker
- Docker-compose
- NodeJS
- MongoDB

## Installation

- Cloner le projet
- Se rendre dans le dossier du projet
- Pour les 2 dossiers :
  - Copier le fichier .env.example et le renommer en docker.env
  - Modifier les variables d'environnement dans le fichier docker.env pour la PRODUCTION et le fichier .env pour le
    DEV
  - Pensez bien à définir les variables d'environnement pour les 2 dossiers
  - C'est notamment là que vous créerez les identifiants de connexion au **compte admin** de l'application
### Pour lancer le projet en mode dev (container + serveur)

- Commentez les services "api-express" et "react-front" dans le fichier docker-compose.yml
- Lancer la commande `docker-compose up --build`
- Ouvrez 2 autres terminaux et lancez les commandes `npm run start` et `npm run dev` dans le dossier "api-express" et "
  react-front"

### Pour lancer le projet en mode prod (container tout en un)

- Décommentez les services "api-express" et "react-front" dans le fichier docker-compose.yml si ce n'est pas déjà fait
- Lancer la commande `docker-compose up --build`

## Utilisation

- Une fois le projet lancé, rendez-vous sur l'adresse `http://localhost:3000` pour accéder à l'application
- Connectez-vous avec le compte administrateur (`email`: email que vous avez défini dans le fichier docker.env, `password`: password que vous avez défini dans le fichier docker.env)
- Créez un compte utilisateur
- Connectez-vous avec le compte utilisateur que vous venez de créer

## Fonctionnalités

- Création de compte
- Connexion
- Création de salon
- Rejoindre un salon
- Partage d'écran
- Chat de groupe
- Chat privé
- Canaux d'équipe
- Conférence vidéo/audio
- Appel vidéo/audio
- Dépot de fichiers
- Gestion des utilisateurs
- Gestion des salons
- Gestion des comptes
- Gestion des équipes

## Technologies utilisées

- NodeJS
- ExpressJS
- Socket.io
- MongoDB
- ReactJS
- Docker
- Docker-compose

## Déploiement

- Lancer la commande `docker-compose up --build`

## Documentation

- [Lien vers la documentation](https://github.com/BUT-MMI3/VisioConf/wiki)

## Auteurs

- [Mathis LAMBERT](https://mathislambert.fr)
- [Arthur MONDON](https://mondon.pro)
- Kyllian DIOCHON
