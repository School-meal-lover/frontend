import { createFileRoute } from '@tanstack/react-router';
import { useIsMobile } from '../contexts/MobileContext';
import DesktopSettings from '../components/Desktop/pages/DesktopSettings';
import MobileSettings from '../components/Mobile/pages/MobileSettings';

export const Route = createFileRoute('/settings')({
    component: RouteComponent,
});

function RouteComponent() {
    const { isMobile } = useIsMobile();
    return isMobile ? <MobileSettings /> : <DesktopSettings />;
}
