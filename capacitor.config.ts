
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.876900f5b0bc4da2a63bf8acb6153a0a',
  appName: 'JU-PLAY',
  webDir: 'dist',
  server: {
    url: 'https://876900f5-b0bc-4da2-a63b-f8acb6153a0a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'JU-PLAY'
  },
  // Add any additional configuration for specific platforms
  plugins: {
    // Configure any Capacitor plugins here
  }
};

export default config;
