import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useIsMobile, MobileProvider } from "../contexts/MobileContext";
import MobileLayout from "../layouts/MobileLayout";
import DesktopLayout from "../layouts/DesktopLayout";
import PwaInstallPrompt from "../components/Mobile/PwaInstallPrompt";

const RootLayout = () => {
  const { isMobile } = useIsMobile();

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
