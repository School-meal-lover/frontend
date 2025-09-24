import { createFileRoute } from '@tanstack/react-router';
import { useIsMobile } from '../../contexts/MobileContext';
import DesktopIntroduce from '../../components/Desktop/pages/DesktopIntroduce';
import MobileIntroduce from '../../components/Mobile/pages/MobileIntroduce';

export const Route = createFileRoute('/menu/introduce')({
  component: RouteComponent,
})

function RouteComponent(){
    const { isMobile } = useIsMobile();
    return isMobile ? <MobileIntroduce /> : <DesktopIntroduce />
}