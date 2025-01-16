# EcoBlissBath

## Description

Code front end du site de vente en ligne de produits de beauté naturel

## Specifications

[Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.  [node.js](https://nodejs.org/dist/v22.13.0/node-v22.13.0-x64.msi)  version 22.13.0. [npm](https://github.com/npm) version 10.9.2. [selenium](https://github.com/SeleniumHQ/selenium) version 4.27.0

## Exécution des tests selenium

1. Téléchager ou cloner le dépôt
2. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`
3. vérifier que [le site](http://localhost:8080) se lance correctement
4. Vérifier que les navigateurs chrome, firefox et edge sont bien installés
5. Depuis un terminal ouvert dans le dossier **frontend/selenium** du projet :
* Lancer la commande : `node TestInscription.js`