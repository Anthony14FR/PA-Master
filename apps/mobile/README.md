# Kennelo Mobile App

Application mobile Next.js avec Capacitor pour iOS et Android.

## 🚀 Installation

### Prérequis

- Node.js >= 18
- pnpm >= 9
- Xcode (pour iOS)
- Android Studio (pour Android)

### Installation des dépendances

```bash
# Depuis la racine du monorepo
pnpm install
```

## 📱 Développement

### 1. Développement Web

```bash
# Depuis apps/mobile/
pnpm dev
```

Ouvre http://localhost:3000

### 2. Build pour mobile

```bash
# Build de l'app Next.js en mode statique
pnpm build
```

Cela génère le dossier `out/` avec votre app statique.

### 3. Initialiser Capacitor (première fois seulement)

```bash
# Initialiser la config Capacitor
pnpm cap:init

# Ajouter les plateformes
pnpm cap:add:ios      # Pour iOS
pnpm cap:add:android  # Pour Android
```

### 4. Synchroniser et ouvrir

```bash
# iOS
pnpm ios:dev

# Android
pnpm android:dev
```

## 🔄 Workflow de développement

### Après chaque modification du code

1. **Build Next.js**
   ```bash
   pnpm build
   ```

2. **Sync avec Capacitor**
   ```bash
   pnpm cap:sync
   ```

3. **Ouvrir dans l'IDE natif**
   ```bash
   pnpm cap:open:ios     # ou
   pnpm cap:open:android
   ```

### Script tout-en-un

```bash
# iOS
pnpm ios:dev

# Android
pnpm android:dev
```

## 🔧 Configuration

### API URL pour le développement local

Dans `.env.local` :

```env
# Utilisez votre IP locale pour tester depuis un vrai device
NEXT_PUBLIC_API_URL=http://192.168.1.X:8000
```

Pour trouver votre IP :
- macOS/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

### Live Reload (optionnel)

Pour activer le live reload sur device physique :

1. Dans `capacitor.config.ts`, décommenter :
   ```ts
   server: {
     url: 'http://192.168.1.X:3000',
     cleartext: true
   }
   ```

2. Lancer le dev server :
   ```bash
   pnpm dev
   ```

3. Sync et ouvrir l'app :
   ```bash
   pnpm cap:sync
   pnpm cap:open:ios
   ```

## 📦 Build de production

### iOS

```bash
pnpm ios:prod
```

Puis dans Xcode :
1. Product → Archive
2. Distribute App → App Store Connect

### Android

```bash
pnpm android:prod
```

Puis dans Android Studio :
1. Build → Generate Signed Bundle / APK
2. Suivre les étapes de signature

## 🎨 Plugins Capacitor utilisés

- **@capacitor/app** - Lifecycle de l'app
- **@capacitor/haptics** - Retour haptique
- **@capacitor/keyboard** - Gestion du clavier
- **@capacitor/preferences** - Stockage local
- **@capacitor/status-bar** - Customisation de la status bar
- **@capacitor/splash-screen** - Écran de démarrage

## 🐛 Troubleshooting

### L'app ne charge pas le contenu

- Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers une URL accessible depuis le device
- Pour dev local, utilisez votre IP locale, pas `localhost`

### Erreur "webDir not found"

- Assurez-vous d'avoir fait `pnpm build` avant `cap:sync`
- Le dossier `out/` doit exister

### Changes not reflected

- Toujours faire `pnpm build` puis `pnpm cap:sync` après modifications
- Ou utiliser live reload pour le développement

### iOS build errors

- Ouvrir le projet dans Xcode
- Nettoyer le build : Product → Clean Build Folder
- Vérifier les signing certificates

### Android build errors

- Ouvrir le projet dans Android Studio
- File → Invalidate Caches / Restart
- Vérifier le SDK Android et les outils

## 📖 Documentation

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## 🔐 Permissions

Les permissions sont gérées dans :
- iOS: `ios/App/App/Info.plist`
- Android: `android/app/src/main/AndroidManifest.xml`

Ajoutez les permissions nécessaires selon vos besoins.