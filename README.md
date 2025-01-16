# EcoBlissBath

## Description

Code front end du site de vente en ligne de produits de beauté naturel

## Specifications

[Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.  [node.js](https://nodejs.org/dist/v22.13.0/node-v22.13.0-x64.msi)  version 22.13.0. [npm](https://github.com/npm) version 10.9.2. [cypress](https://github.com/cypress-io/cypress) version 13.17.0

## Exécution des tests cypress

1. Téléchager ou cloner le dépôt
2. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`
3. vérifier que [le site](http://localhost:8080) se lance correctement
4. Depuis un terminal ouvert dans le dossier **frontend** du projet :
* lancer la commande : `npx cypress run --browser chrome` pour le test sous _chrome_
* lancer la commande : `npx cypress run --browser firefox` pour le test sous _firefox_
* lancer la commande : `npx cypress run --browser edge` pour le test sous _edge_
