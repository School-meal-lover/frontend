import { createFileRoute } from '@tanstack/react-router';
import { useIsMobile } from '../../contexts/MobileContext';
import DesktopCongestion from '../../components/Desktop/pages/DesktopCongestion';
import MobileCongestion from '../../components/Mobile/pages/MobileCongestion';

export const Route = createFileRoute('/menu/congestion')({
  component : RouteComponent,
});

function RouteComponent(){
    const { isMobile } = useIsMobile();
    return isMobile ? <MobileCongestion /> : <DesktopCongestion />
}