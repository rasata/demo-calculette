# Calculatrice Scientifique

Une application web de calculatrice scientifique développée avec JavaScript vanilla pour le frontend et Node.js/Express pour le backend. Cette calculatrice offre une interface utilisateur inspirée de la calculatrice macOS avec un design responsive.

![Calculatrice Scientifique](https://via.placeholder.com/400x600?text=Calculatrice+Scientifique)

## Fonctionnalités

- Opérations arithmétiques de base (addition, soustraction, multiplication, division)
- Fonctions scientifiques (sin, cos, tan, log, racine carrée, puissance)
- Constantes mathématiques (π)
- Support des parenthèses pour les expressions complexes
- Historique des calculs
- Interface responsive adaptée aux appareils mobiles
- Support des entrées clavier

## Prérequis

- [Node.js](https://nodejs.org/) (v14.0.0 ou supérieur)
- [npm](https://www.npmjs.com/) (v6.0.0 ou supérieur)

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-nom/calculatrice-scientifique.git
   cd calculatrice-scientifique
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez l'application :
   ```bash
   npm start
   ```

4. Ouvrez votre navigateur et accédez à :
   ```
   http://localhost:3000
   ```

## Développement

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

## Structure du projet

```
calculatrice-scientifique/
├── node_modules/        # Dépendances (générées par npm)
├── public/              # Fichiers statiques
│   ├── index.html       # Page HTML principale
│   ├── styles.css       # Styles CSS
│   └── app.js           # Code JavaScript frontend
├── server.js            # Serveur Express
├── package.json         # Configuration npm et dépendances
├── package-lock.json    # Versions exactes des dépendances
└── README.md            # Documentation
```

## Dépendances

### Production
- **express** : Framework web minimaliste pour Node.js

### Développement
- **nodemon** : Utilitaire qui surveille les changements de fichiers et redémarre automatiquement le serveur

## Fonctionnement

La calculatrice utilise JavaScript vanilla pour gérer les calculs côté client. Les expressions mathématiques sont évaluées de manière sécurisée à l'aide de la fonction `Function` plutôt que `eval()`.

Les fonctions scientifiques sont implémentées à l'aide des méthodes natives de l'objet `Math` de JavaScript.

## Personnalisation

Vous pouvez personnaliser l'apparence de la calculatrice en modifiant le fichier `styles.css`. Les couleurs actuelles sont inspirées du thème sombre de macOS.

## Guide de contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

MIT

## Auteur

Votre Nom
