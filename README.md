# dodo-corp

Point de départ du projet dodo-corp et du lecteur musical local Sonaris.

## Sonaris

Sonaris est une première application desktop de lecture musicale locale :

- aucune création de compte ;
- aucune publicité ;
- aucune connexion à un service distant pour lire la bibliothèque ;
- utilisation de fichiers audio que l’utilisateur possède ou est autorisé à utiliser ;
- sélection d’un dossier local, détection des formats audio courants, lecture, pause, titre précédent et titre suivant.

Le prototype utilise Electron et une interface HTML/CSS/JavaScript locale. Il ne téléverse pas les fichiers audio et ne dépend d’aucun service musical en ligne.

## Développement local

Prérequis : Node.js et npm.

```bash
npm install
npm start
```

La vérification syntaxique peut être exécutée avec :

```bash
npm run check
```

## Packaging

Les scripts de packaging produisent les archives attendues par le workflow de release :

- `dist/Sonaris-{version}-windows.zip`
- `dist/Sonaris-{version}-macos.zip`
- `dist/Sonaris-{version}-linux.zip`

Commandes disponibles :

```bash
npm run package:win
npm run package:mac
npm run package:linux
```

Les builds officiels sont réalisés par GitHub Actions via `.github/workflows/release.yml`, sur les runners Windows, macOS et Linux. La version `0.1.0` reste une préversion tant qu’un build réel n’a pas produit les trois archives attendues.

## Structure

- `main.js` et `preload.js` : processus principal Electron et pont sécurisé ;
- `renderer/` : interface locale Sonaris ;
- `scripts/` : wrappers de build et normalisation des artefacts ;
- `src/` : code source du site public ;
- `tests/` : tests automatisés ;
- `docs/` : documentation du projet ;
- `.github/workflows/` : intégration continue et publication des releases.

## Site et releases

Le site public est disponible sur [GitHub Pages](https://phoneguy2206.github.io/dodo-corp/).

Les notes de version sont disponibles sur [la page des releases](https://phoneguy2206.github.io/dodo-corp/releases.html).

Les liens de téléchargement ne sont publiés qu’après la production réelle des artefacts par GitHub Actions.
