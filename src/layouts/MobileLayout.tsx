import MobileHeader from '../components/Mobile/MobileHeader';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <MobileHeader />
    {children}
    </>
  );
}
