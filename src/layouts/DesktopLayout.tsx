import DesktopHeader from '../components/Desktop/DesktopHeader';

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <DesktopHeader />
    {children}
    </>
  );
}
