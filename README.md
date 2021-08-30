# Interface web du projet Belisama

## Vue d'ensemble

Vous trouverez dans ce répertoire l'ensemble des fichiers Javacript, CSS et HTML ayant servi à l'élaboration du site Internet Belisama : www.belisama.ml

Le projet Belisama vise à améliorer la détection des orages par l'étude du rayonnement gamma. Les détecteurs enregistrent et envoient des données qui sont stockées sur Amazon Web Service Simple Service Stockage et le contenu de ces données est visible sur le site internet. 

L'interface web permet de visualiser les données des détecteurs selon différents critères fixés par l'utilisateur. Le téléchargement des données a été rendu possible dans l'onglet `Téléchargement` une fois un détecteur sélectionné et le projet est discuté plus en profondeur dans l'onglet `A propos`. Des comparaisons sont accessibles via l'onglet `Analyse` pour comparer les données de deux périodes ou de deux détecteurs. 

### Organisation du répertoire

Les principaux composants du site sont localisés dans le dossier `components` et classés par thématique. Certains composants sont utilisés à plusieurs reprises dans le code et des chemins sont spécifiés dans les lignes d'importation pour mieux comprendre la structure du code.

L'accueil du site Internet fait intervenir les dossiers DetectorMap et DetectorList pour l'affichage de la carte et de la liste respectivement. Le dossier DataVisu permet le chargement des données d'un détecteur choisi et l'affichage des trois sections : Comptage, énergie et téléchargement (des dossiers Count, Energy et Download respectivement). L'affichage de la météo sur la page Comptage se fait à partir du dossier Weather. Dans le dossier Chart se trouve les fonctions servant à l'affichage de graphique. Les onglets Analyse et A propos font intervenir les dossiers Comparaison et MoreInfo. Le premier dispose d'un fichier index permettant le chargement des informations de tous les détecteurs et l'affichage des onglets Comparaison par détecteur ou par période. Ces derniers font appel à des fonctions comprises dans le dossier Comparaison pour le choix des critères à étudier (détecteur, type de graphique). Selon le type de graphique est transmis un appel vers les fonctions Count ou Energy qui permettent l'affichage des graphiques.
Le A propos affiche une timeline redirigeant vers des pages du site de présentation du projet Belisama(https://ikhone.wixsite.com/belisama) et vers une page de vidéos (voir dossier DisplayVideos)


### Installation d'une version du site Internet en local host

Téléchargez le dépôt sur votre ordinateur et placez vous dans ce répertoire sur Virtual Studio Code. 
Il vous suffit de taper la commande npm install pour télécharger les packages associés au site Internet. 
Une fois les téléchargements terminés, lancez la commande npm start pour ouvrir un local host et visualiser le site Internet.

### Crédits

Le projet a été réalisé sous la tutelle de Philippe Laurent, chercheur au CEA et au Laboratoire d'AstroParticule et Cosmologie (APC).
Ont contribué au projet Louis Moreau, Hugo Marchand et Li-fan Zhao.


