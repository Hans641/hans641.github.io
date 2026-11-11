# Portfolio — Hans RANOHARISON

Site statique (HTML, CSS, JavaScript) conçu pour être publié sur **GitHub Pages**.

## Lien prévu

https://hans641.github.io/

## Publication en ligne

1. Se connecter à GitHub avec le compte `Hans641`.
2. Créer un dépôt **public** appelé `hans641.github.io` via https://github.com/new.
3. Cocher `Add a README file` puis cliquer sur `Create repository`.
4. Ajouter les fichiers de ce dossier **à la racine** du dépôt (pas dans un sous-dossier).
5. Ouvrir `Settings` > `Pages` > `Build and deployment` > `Source: Deploy from a branch`.
6. Sous `Branch`, sélectionner `main` et `/(root)` puis `Save`.
7. Vérifier `https://hans641.github.io/` une fois GitHub Pages publié.

> `.nojekyll` désactive la construction Jekyll afin que les fichiers soient servis directement.

## Mettre à jour le site

Modifier `index.html`, `styles.css`, `script.js` ou les fichiers `assets/`, puis pousser les changements sur `main`. GitHub Pages republie après la mise à jour.

## Structure

- `index.html` — page d’accueil et métadonnées
- `styles.css` — styles responsives
- `script.js` — filtres des projets, fenêtres de détails, navigation mobile, thème
- `assets/hans-portrait.jpg` — portrait
- `assets/CV_Hans_RANOHARISON.docx` — CV à télécharger
- `assets/favicon.svg` — favicon
- `.nojekyll` — publication statique

## Test local

```bash
python3 -m http.server 8000
```

Le formulaire de contact utilise des liens email, sans backend. Le portfolio ne contient aucun système d'authentification ni de collecte de données. Les illustrations des projets ne sont pas des captures d'écran des applications.
