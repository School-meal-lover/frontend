/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "vite-plugin-pwa" {
  export interface VitePWAOptions {
    registerType?: "autoUpdate" | "prompt";
    devOptions?: {
      enabled?: boolean;
    };
    includeAssets?: string[];
    manifest?: {
      name?: string;
      short_name?: string;
      start_url?: string;
      scope?: string;
      display?: string;
      background_color?: string;
      theme_color?: string;
      icons?: Array<{
        src: string;
        sizes?: string;
        type?: string;
        purpose?: string;
      }>;
    };
    workbox?: {
      navigateFallback?: string;
      runtimeCaching?: Array<{
        urlPattern: (context: { request?: Request; url?: URL }) => boolean;
        handler: string;
        options?: {
          cacheName?: string;
          expiration?: {
            maxEntries?: number;
            maxAgeSeconds?: number;
          };
        };
      }>;
    };
  }

  export function VitePWA(options?: VitePWAOptions): any;
}

declare module "virtual:pwa-register" {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}
