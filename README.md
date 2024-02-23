# Front-end Boilerplate utilise bootstrap sass/scss & Gulp 4

## Guide d'utilisation

### Node v18.17.1

* Cloner & télécharger le paquet Git repo dans voter PC.
* Installer [Node.js](https://nodejs.org/).
* executer `npm install` 
* `gulp` pour les tâche par default
* `build` pour builer le projet
* `gulp images` exporter les images
* `gulp allPlugins` exporter tous les fichiers JS, images & Fonts dans `dist/vendor` (Bootstrap, Jquery, Slick, Lodash, Lazysize, mCustomScrollBar)
* `gulp allSass` exporter tous les fichiers scss et css dans `src/vendor` (Bootstrap, Slick, mCustomScrollBar)

Dans cette projet, Gulp est configurer pour executer les fonctions suivant: 

* Compile les fichier SCSS vers CSS
* Autoprefixer & minifier le fichier CSS
* Fusionner & minifier les fichiers js 
* Créer & ajouter les fichiers compliler dans `/dist`