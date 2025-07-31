import { createFileRoute, useParams } from '@tanstack/react-router';
import { useIsMobile } from '../../contexts/MobileContext'
import MobileDate from '../../components/Mobile/pages/MobileDate'
import DesktopDate from '../../components/Desktop/pages/DesktopDate';

export const Route = createFileRoute('/menu/$date')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isMobile } = useIsMobile();
  const { date } = useParams({from: "/menu/$date"});

  return isMobile ? (
    <MobileDate date={date} />
  ) : (
    <DesktopDate date={date} />
  )
}