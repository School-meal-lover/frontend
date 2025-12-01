import { useTranslation } from 'react-i18next';

export default function DesktopSettings() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="bg-[#F8F4F1] min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* 제목 */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings.title')}</h1>

                {/* 언어 설정 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-8 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-4"></span>
                        {t('settings.language')}
                    </h2>

                    {/* 토글 버튼 */}
                    <div className="flex items-center justify-start">
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleLanguageChange('ko')}
                                className={`py-3 px-8 rounded-lg font-semibold transition-all duration-200 ${currentLanguage === 'ko'
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t('settings.korean')}
                            </button>
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className={`py-3 px-8 rounded-lg font-semibold transition-all duration-200 ${currentLanguage === 'en'
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t('settings.english')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 설명 텍스트 */}
                <p className="text-sm text-gray-500 px-2">
                    {currentLanguage === 'ko'
                        ? '선택한 언어는 자동으로 저장되며, 다음 방문 시에도 유지됩니다.'
                        : 'Your language preference is saved automatically and will be remembered on your next visit.'}
                </p>
            </div>
        </div>
    );
}
