import { PWAInstallState, NotificationPermissionState } from '../types/NotificationTypes';

/**
 * PWA가 설치되어 있는지 확인
 */
export function isPWAInstalled(): PWAInstallState {
    // display-mode를 통해 PWA 설치 여부 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return 'installed';
    }

    // iOS Safari의 경우
    if ((window.navigator as any).standalone === true) {
        return 'installed';
    }

    // 일반 브라우저
    if (window.matchMedia('(display-mode: browser)').matches) {
        return 'not-installed';
    }

    return 'unknown';
}

/**
 * 현재 알림 권한 상태 반환
 */
export function getNotificationPermission(): NotificationPermissionState {
    if (!('Notification' in window)) {
        return 'denied';
    }

    return Notification.permission as NotificationPermissionState;
}

/**
 * 알림 권한 요청
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return 'denied';
    }

    try {
        const permission = await Notification.requestPermission();
        return permission as NotificationPermissionState;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'denied';
    }
}

/**
 * 푸시 알림 구독 (추후 백엔드 연동용)
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications are not supported');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // 이미 구독되어 있는지 확인
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // VAPID public key는 추후 백엔드 구현 시 설정 필요
            // subscription = await registration.pushManager.subscribe({
            //   userVisibleOnly: true,
            //   applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            // });
        }

        return subscription;
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        return null;
    }
}

/**
 * 브라우저별 알림 설정 도움말 URL 반환
 */
export function getNotificationHelpUrl(): { chrome: string; safari: string; samsung: string } {
    return {
        chrome: 'https://support.google.com/chrome/answer/3220216',
        safari: 'https://support.apple.com/guide/safari/customize-website-notifications-sfri40734/mac',
        samsung: 'https://www.samsung.com/uk/support/mobile-devices/how-do-i-turn-on-notifications-for-the-samsung-internet-app/',
    };
}

/**
 * BeforeInstallPromptEvent 저장용 (전역으로 관리하거나 Context로 관리 가능)
 */
let deferredPrompt: any = null;

export function setDeferredPrompt(event: any) {
    deferredPrompt = event;
}

export function getDeferredPrompt() {
    return deferredPrompt;
}

export async function showInstallPrompt(): Promise<boolean> {
    if (!deferredPrompt) {
        return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    deferredPrompt = null;

    return outcome === 'accepted';
}

/**
 * 테스트 푸시 알림 전송 (디버그용)
 */
export async function sendTestNotification(delaySeconds: number = 0): Promise<boolean> {
    console.log('🔔 sendTestNotification 호출됨, delay:', delaySeconds);

    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        alert('❌ 이 브라우저는 알림을 지원하지 않습니다.');
        console.warn('Notifications not supported');
        return false;
    }

    // 알림 권한 확인 및 요청
    let permission = Notification.permission;
    console.log('현재 알림 권한:', permission);

    if (permission === 'default') {
        console.log('알림 권한 요청 중...');
        permission = await Notification.requestPermission();
        console.log('알림 권한 요청 결과:', permission);
    }

    if (permission !== 'granted') {
        alert('❌ 알림 권한이 필요합니다. 브라우저 설정에서 알림을 허용해주세요.');
        console.warn('Notification permission not granted:', permission);
        return false;
    }

    try {
        console.log('Service Worker 확인 중...');
        const registration = await navigator.serviceWorker.ready;
        console.log('✅ Service Worker 준비됨:', registration);

        alert(`✅ ${delaySeconds}초 후 테스트 알림이 전송됩니다!`);

        // 지연 후 알림 표시
        setTimeout(async () => {
            console.log('알림 전송 시작...');
            try {
                await registration.showNotification('🍽️ 꼬르륵 테스트 알림', {
                    body: '푸시 알림이 정상적으로 작동합니다!',
                    icon: '/icon-192.png',
                    badge: '/icon-144.png',
                    tag: 'test-notification',
                    requireInteraction: false,
                });
                console.log('✅ showNotification 호출 완료');
            } catch (notifError) {
                console.error('❌ showNotification 오류:', notifError);
                alert('❌ 알림 표시 실패: ' + notifError);
            }
        }, delaySeconds * 1000);

        return true;
    } catch (error) {
        alert('❌ 알림 전송 중 오류가 발생했습니다: ' + error);
        console.error('Error sending test notification:', error);
        return false;
    }
}
