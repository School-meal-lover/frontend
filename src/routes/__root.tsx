import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useIsMobile, MobileProvider } from "../contexts/MobileContext";
import MobileLayout from "../layouts/MobileLayout";
import DesktopLayout from "../layouts/DesktopLayout";
import PwaInstallPrompt from "../components/Mobile/PwaInstallPrompt";

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
});
