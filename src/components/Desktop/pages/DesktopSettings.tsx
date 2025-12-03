import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationSettings, MealType } from '../../../types/NotificationTypes';
import { getNotificationSettings, saveNotificationSettings } from '../../../utils/storageUtils';
import {
    isPWAInstalled,
    getNotificationPermission,
    requestNotificationPermission,
    showInstallPrompt,
    getDeferredPrompt,
    getNotificationHelpUrl,
} from '../../../utils/pwaUtils';

export default function DesktopSettings() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    // 알림 설정 상태
    const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
    const [pwaInstalled, setPwaInstalled] = useState(isPWAInstalled());
    const [notificationPermission, setNotificationPermission] = useState(getNotificationPermission());

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    // 설정 변경 핸들러
    const handleToggleEnabled = () => {
        const newSettings = { ...settings, enabled: !settings.enabled };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
    };

    const handleToggleMeal = (mealType: MealType) => {
        const newSettings = {
            ...settings,
            meals: {
                ...settings.meals,
                [mealType]: {
                    ...settings.meals[mealType],
                    enabled: !settings.meals[mealType].enabled,
                },
            },
        };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
    };

    const handleTimeChange = (mealType: MealType, time: string) => {
        const newSettings = {
            ...settings,
            meals: {
                ...settings.meals,
                [mealType]: {
                    ...settings.meals[mealType],
                    time,
                },
            },
        };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
    };

    const handleToggleWeekdays = () => {
        const newSettings = { ...settings, weekdays: !settings.weekdays };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
    };

    const handleToggleWeekends = () => {
        const newSettings = { ...settings, weekends: !settings.weekends };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
    };

    const handleRequestPermission = async () => {
        const permission = await requestNotificationPermission();
        setNotificationPermission(permission);
    };

    const handleInstallPWA = async () => {
        const installed = await showInstallPrompt();
        if (installed) {
            setPwaInstalled('installed');
        }
    };

    const helpUrls = getNotificationHelpUrl();

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
                    <div className="flex items-center justify-start mb-4">
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

                    {/* 언어 설정 안내 */}
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>{t('settings.languageNotice')}</p>
                        {currentLanguage === 'en' && (
                            <p>{t('settings.untranslatedNotice')}</p>
                        )}
                    </div>
                </div>

                {/* 푸시 알림 설정 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-8 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-4"></span>
                        {t('notifications.title')}
                    </h2>

                    {/* PWA 미설치 안내 */}
                    {pwaInstalled === 'not-installed' && (
                        <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                {t('notifications.pwaNotInstalled.title')}
                            </h3>
                            <p className="text-sm text-blue-700 mb-3">
                                {t('notifications.pwaNotInstalled.message')}
                            </p>
                            {getDeferredPrompt() && (
                                <button
                                    onClick={handleInstallPWA}
                                    className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    {t('notifications.pwaNotInstalled.install')}
                                </button>
                            )}
                        </div>
                    )}

                    {/* 알림 권한 필요 안내 */}
                    {pwaInstalled === 'installed' && notificationPermission === 'default' && (
                        <div className="mb-6 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="font-semibold text-yellow-900 mb-2">
                                {t('notifications.permissionNeeded.title')}
                            </h3>
                            <p className="text-sm text-yellow-700 mb-3">
                                {t('notifications.permissionNeeded.message')}
                            </p>
                            <button
                                onClick={handleRequestPermission}
                                className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                            >
                                {t('notifications.permissionNeeded.allow')}
                            </button>
                        </div>
                    )}

                    {/* 알림 권한 거절 안내 */}
                    {pwaInstalled === 'installed' && notificationPermission === 'denied' && (
                        <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-red-900 mb-2">
                                {t('notifications.permissionDenied.title')}
                            </h3>
                            <p className="text-sm text-red-700 mb-3">
                                {t('notifications.permissionDenied.message')}
                            </p>
                            <div className="text-sm text-red-700">
                                {t('notifications.permissionDenied.helpLinks').split('|').map((link, idx) => {
                                    const urls = [helpUrls.chrome, helpUrls.safari, helpUrls.samsung];
                                    return (
                                        <span key={idx}>
                                            {idx > 0 && ' | '}
                                            <a
                                                href={urls[idx]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-red-900"
                                            >
                                                {link.trim()}
                                            </a>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 마스터 토글 */}
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-medium text-gray-700 text-lg">{t('notifications.enable')}</span>
                        <button
                            onClick={handleToggleEnabled}
                            disabled={pwaInstalled !== 'installed' || notificationPermission !== 'granted'}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${settings.enabled ? 'bg-orange-500' : 'bg-gray-300'
                                } ${pwaInstalled !== 'installed' || notificationPermission !== 'granted'
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.enabled ? 'translate-x-9' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* 식사별 알림 설정 */}
                    {settings.enabled && (
                        <div>
                            <h3 className="font-semibold text-gray-700 text-lg mb-4">
                                {t('notifications.mealsTitle')}
                            </h3>

                            <div className="space-y-4 mb-8">
                                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((mealType) => (
                                    <div key={mealType} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.meals[mealType].enabled}
                                                    onChange={() => handleToggleMeal(mealType)}
                                                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 mr-3"
                                                />
                                                <span className="font-medium text-gray-700 text-base">
                                                    {t(`notifications.${mealType}`)}
                                                </span>
                                            </label>
                                            <input
                                                type="time"
                                                value={settings.meals[mealType].time}
                                                onChange={(e) => handleTimeChange(mealType, e.target.value)}
                                                disabled={!settings.meals[mealType].enabled}
                                                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 요일 설정 */}
                            <h3 className="font-semibold text-gray-700 text-lg mb-4">
                                {t('notifications.daysTitle')}
                            </h3>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer flex-1 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={settings.weekdays}
                                        onChange={handleToggleWeekdays}
                                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 mr-3"
                                    />
                                    <span className="font-medium text-gray-700 text-base">
                                        {t('notifications.weekdays')}
                                    </span>
                                </label>
                                <label className="flex items-center cursor-pointer flex-1 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={settings.weekends}
                                        onChange={handleToggleWeekends}
                                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 mr-3"
                                    />
                                    <span className="font-medium text-gray-700 text-base">
                                        {t('notifications.weekends')}
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
