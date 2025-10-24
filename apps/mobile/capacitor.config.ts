import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kennelo.app',
  appName: 'Kennelo',
  webDir: 'out',
  server: {
    androidScheme: 'http',  // Changé en HTTP pour le développement (permet les requêtes HTTP vers l'API)
    iosScheme: 'http',      // Changé en HTTP pour le développement
    cleartext: true,        // Autorise les connexions HTTP non sécurisées (dev uniquement)
    // Pour le développement avec live reload (optionnel)
    // url: 'http://192.168.1.X:3000',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
};

export default config;
