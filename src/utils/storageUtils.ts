import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '../types/NotificationTypes';

const NOTIFICATION_SETTINGS_KEY = 'grrrr_notification_settings';
const PWA_FIRST_INSTALL_SHOWN_KEY = 'grrrr_pwa_first_install_shown';

/**
 * 로컬 스토리지에서 알림 설정 불러오기
 */
export function getNotificationSettings(): NotificationSettings {
    try {
        const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading notification settings:', error);
    }

    return DEFAULT_NOTIFICATION_SETTINGS;
}

/**
 * 로컬 스토리지에 알림 설정 저장
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
    try {
        localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving notification settings:', error);
    }
}

/**
 * PWA 설치 모달을 이미 표시했는지 확인
 */
export function getPWAFirstInstallShown(): boolean {
    try {
        return localStorage.getItem(PWA_FIRST_INSTALL_SHOWN_KEY) === 'true';
    } catch (error) {
        console.error('Error checking PWA first install shown:', error);
        return false;
    }
}

/**
 * PWA 설치 모달 표시 완료 표시
 */
export function setPWAFirstInstallShown(): void {
    try {
        localStorage.setItem(PWA_FIRST_INSTALL_SHOWN_KEY, 'true');
    } catch (error) {
        console.error('Error setting PWA first install shown:', error);
    }
}
