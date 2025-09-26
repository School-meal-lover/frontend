import MobileHeader from '../components/Mobile/MobileHeader';
import MobileFooter from '../components/Mobile/MobileFooter';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <MobileHeader />
    {children}
    <MobileFooter />
    </>
  );
}
