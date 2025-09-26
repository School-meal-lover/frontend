import DesktopHeader from '../components/Desktop/DesktopHeader';
import DesktopFooter from '../components/Desktop/DesktopFooter';

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <DesktopHeader />
    {children}
    <DesktopFooter />
    </>
  );
}
