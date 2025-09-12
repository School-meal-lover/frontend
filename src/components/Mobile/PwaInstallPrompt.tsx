import { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "../../contexts/MobileContext";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isStandalone = () => {
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  if ((window.navigator as any).standalone) return true;
  return false;
};

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export default function PwaInstallPrompt() {
  const { isMobile } = useIsMobile();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isMobile || isStandalone()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
  }, [isMobile]);

  const onInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setOpen(false);
    setDeferredPrompt(null);
  };

  const onClose = () => setOpen(false);

  const isIosMobile = useMemo(() => isIos() && isMobile, [isMobile]);

  if (!open || isStandalone()) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full sm:max-w-sm sm:rounded-2xl bg-white text-gray-900 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <img src="/GRRRR.svg" alt="app icon" className="w-8 h-8" />
          <div className="font-semibold">꼬르륵(Grrr) 앱 설치</div>
        </div>
        {isIosMobile ? (
          <div className="text-sm leading-6">
            iOS에서는 브라우저 메뉴의 공유 버튼을 누른 뒤 "홈 화면에 추가"를
            선택해 설치할 수 있어요.
          </div>
        ) : (
          <div className="text-sm leading-6">
            빠른 실행과 오프라인 사용을 위해 홈 화면에 앱을 설치해 보세요.
          </div>
        )}
        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
          >
            나중에
          </button>
          {!isIosMobile && (
            <button
              onClick={onInstall}
              className="px-3 py-2 rounded-lg bg-black text-white text-sm"
            >
              설치
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
