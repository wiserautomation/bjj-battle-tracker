
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.ju.play',
  appName: 'JU-PLAY',
  webDir: 'dist',
  server: {
    url: 'https://876900f5-b0bc-4da2-a63b-f8acb6153a0a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'JU-PLAY',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0b112e'
  },
  android: {
    backgroundColor: '#0b112e'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0b112e",
      splashImmersive: true,
      splashFullScreen: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
