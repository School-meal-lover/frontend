import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useIsMobile, MobileProvider } from '../contexts/MobileContext';
import MobileLayout from '../layouts/MobileLayout';
import DesktopLayout from '../layouts/DesktopLayout';

const RootLayout = () => {
  const { isMobile } = useIsMobile();

  return isMobile ? (
    <MobileLayout>
      <Outlet />
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
