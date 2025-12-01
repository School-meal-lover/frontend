import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './global.css';
import './i18n';
import { registerSW } from 'virtual:pwa-register';
import PWAInstallModal from './components/PWAInstallModal';
import { setDeferredPrompt, isPWAInstalled } from './utils/pwaUtils';
import { getPWAFirstInstallShown } from './utils/storageUtils';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Main App 컴포넌트
function App() {
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // beforeinstallprompt 이벤트 저장
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // PWA 설치 감지
    const handleAppInstalled = () => {
      console.log('PWA installed');

      // 처음 설치한 경우에만 모달 표시
      if (!getPWAFirstInstallShown()) {
        // 약간의 지연 후 모달 표시 (설치 완료 후 자연스럽게)
        setTimeout(() => {
          setShowInstallModal(true);
        }, 1000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <StrictMode>
      <RouterProvider router={router} />
      {showInstallModal && <PWAInstallModal onClose={() => setShowInstallModal(false)} />}
    </StrictMode>
  );
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<App />);
}

const updateSW = registerSW({
  onNeedRefresh() { },
  onOfflineReady() { },
});
