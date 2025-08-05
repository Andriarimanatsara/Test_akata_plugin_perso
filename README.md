## Fonctionnalités
- Bloc Gutenberg personnalisable : **Météo géolocalisée**.
- Requête météo dynamique selon la position de l’utilisateur.
- Stockage en base de données des données météo pour optimisation.
- Affichage stylé (température, condition météo, ville, etc.).

## Creation compte pour acceder à l'api
#me connecter dans mon compte https://www.weatherapi.com/
#voici mon API KEY: 3091e9432d5447a79cf125943250208

## Installation et création du structure du projet
#creation de mon fichier qui contient mon plugin dans "wp-content\plugins\"
#Le nom du fichier de mon plugin est "wp-weather-block"
#creation du fichier de plugin principal wp-weather-block.php
#création du dossier qui contient le fichier js et le fichier json(structure:wp-content\plugins\wp-weather-block\block\)
->Il enregistre un bloc personnalisé pour l'éditeur Gutenberg avec :
    ->le nom du bloc (wpwb/weather-block),
    ->son titre, son icône, sa catégorie,
    ->le comportement dans l’éditeur (fonction edit()),
    ->et la logique de sauvegarde (save()).
->Quand tu ajoutes un bloc dans un article ou une page via Gutenberg :
    ->C’est block.js qui définit ce que tu vois visuellement dans l’éditeur (donc le rendu React).
    ->C’est aussi lui qui définit comment le bloc enregistre ses données dans la base WordPress.
#création du dossier qui contient le fichier js pour l'affichage frontend(structure:wp-content\plugins\wp-weather-block\block\)
->Ce fichier contient le JavaScript exécuté côté navigateur (frontend du site WordPress).Il ne sert pas dans l’éditeur Gutenberg, mais dans la page publique visible par les visiteurs
    ->Obtenir la position géographique de l’utilisateur
    ->Envoyer cette position à WordPress (AJAX)
    ->Recevoir les données météo depuis PHP
    ->Afficher les données météo dans la page

#création du dossier include(structure:wp-content\plugins\wp-weather-block\) qui contient le fonction php "weather-functions.php"
->C’est ici qu’on fait la requête vers l’API météo avec la clé privée
->Envoyer les données météo au JavaScript (frontend.js)
->Enregistrer les données météo dans la base de données

#Activer le plugin quand dans wordpress(extension->WP Weather Block->Activer)
