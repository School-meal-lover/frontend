import { createRootRoute, Outlet, useLocation, notFound } from "@tanstack/react-router";
import { useIsMobile, MobileProvider } from "../contexts/MobileContext";
import MobileLayout from "../layouts/MobileLayout";
import DesktopLayout from "../layouts/DesktopLayout";
import PwaInstallPrompt from "../components/Mobile/PwaInstallPrompt";
import { useTranslation } from "react-i18next";

// 404 페이지 컴포넌트
const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">{t('notFound.title')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('notFound.message')}</p>
        <a
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {t('notFound.button')}
        </a>
      </div>
    </div>
  );
};

const RootLayout = () => {
  const { isMobile } = useIsMobile();
  const location = useLocation();

  // upload 페이지에서는 헤더 제외
  const isUploadPage = location.pathname === '/upload';

  if (isUploadPage) {
    return <Outlet />;
  }

  return isMobile ? (
    <MobileLayout>
      <Outlet />
      <PwaInstallPrompt />
    </MobileLayout>
  ) : (
    <DesktopLayout>
      <Outlet />
    </DesktopLayout>
  );
};

export const Route = createRootRoute({
  component: () => (
    <MobileProvider>
      <RootLayout />
    </MobileProvider>
  ),
  notFoundComponent: () => (
    <MobileProvider>
      <NotFoundPage />
    </MobileProvider>
  ),
});
