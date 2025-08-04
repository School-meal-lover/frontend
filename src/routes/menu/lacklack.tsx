import { createFileRoute } from '@tanstack/react-router';
import { useIsMobile } from '../../contexts/MobileContext';
import DesktopLacklack from '../../components/Desktop/pages/DesktopLacklack';
import MobileLacklack from '../../components/Mobile/pages/MobileLacklack';

export const Route = createFileRoute('/menu/lacklack')({
  component : RouteComponent,
});

function RouteComponent(){
    const { isMobile } = useIsMobile();
    return isMobile ? <MobileLacklack /> : <DesktopLacklack />
}