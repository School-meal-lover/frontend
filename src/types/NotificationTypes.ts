export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealNotificationConfig {
    enabled: boolean;
    time: string; // HH:mm 형식
}

export interface NotificationSettings {
    enabled: boolean; // 마스터 토글
    meals: {
        breakfast: MealNotificationConfig;
        lunch: MealNotificationConfig;
        dinner: MealNotificationConfig;
    };
    weekdays: boolean; // 평일
    weekends: boolean; // 주말
}

export type PWAInstallState = 'installed' | 'not-installed' | 'unknown';

export type NotificationPermissionState = 'granted' | 'denied' | 'default';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    enabled: false,
    meals: {
        breakfast: {
            enabled: true,
            time: '08:00',
        },
        lunch: {
            enabled: true,
            time: '12:00',
        },
        dinner: {
            enabled: true,
            time: '17:00',
        },
    },
    weekdays: true,
    weekends: true,
};
