import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestNotificationPermission } from '../utils/pwaUtils';
import { setPWAFirstInstallShown } from '../utils/storageUtils';

interface PWAInstallModalProps {
    onClose: () => void;
}

export default function PWAInstallModal({ onClose }: PWAInstallModalProps) {
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAccept = async () => {
        setIsProcessing(true);

        // 알림 권한 요청
        await requestNotificationPermission();

        // 모달 표시 완료 표시
        setPWAFirstInstallShown();

        // 설정 페이지로 이동 (window.location 사용)
        window.location.href = '/settings';

        onClose();
    };

    const handleDecline = () => {
        setPWAFirstInstallShown();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 pwa-install-modal-fade-in">
                {/* 아이콘 */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </div>
                </div>

                {/* 제목 */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                    {t('pwaInstallModal.title')}
                </h2>

                {/* 설명 */}
                <p className="text-gray-600 text-center mb-6">
                    {t('pwaInstallModal.message')}
                </p>

                {/* 버튼 */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDecline}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('pwaInstallModal.decline')}
                    </button>
                    <button
                        onClick={handleAccept}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 bg-orange-500 text-white hover:bg-orange-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? '...' : t('pwaInstallModal.accept')}
                    </button>
                </div>
            </div>
        </div>
    );
}
