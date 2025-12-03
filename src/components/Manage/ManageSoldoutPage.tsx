import React, { useState, useEffect } from 'react';
import ManageHeader from './ManageHeader';
import Modal from '../Upload/Modal';
import { useMediaQuery } from 'react-responsive';
import MobileFooter from '../Mobile/MobileFooter';
import DesktopFooter from '../Desktop/DesktopFooter';

type RestaurantType = 'RESTAURANT_1' | 'RESTAURANT_2';

const ManageSoldoutPage = () => {
    const [bearerToken, setBearerToken] = useState<string>('');
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType>('RESTAURANT_1');
    const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
    const [isWithinServiceTime, setIsWithinServiceTime] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'error'>('success');

    const isMobile = useMediaQuery({ maxWidth: 639 });

    // Load bearer token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('manage_bearer_token');
        if (savedToken) {
            setBearerToken(savedToken);
        }
    }, []);

    // Check if current time is within service hours
    useEffect(() => {
        const checkServiceTime = () => {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

            // Weekend check
            if (day === 0 || day === 6) {
                setIsWithinServiceTime(false);
                return;
            }

            // Time check (11:30 - 13:30)
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hours * 60 + minutes;
            const startTime = 11 * 60 + 30; // 11:30
            const endTime = 13 * 60 + 30;   // 13:30

            setIsWithinServiceTime(currentTime >= startTime && currentTime <= endTime);
        };

        checkServiceTime();
        // Re-check every minute
        const interval = setInterval(checkServiceTime, 60000);

        return () => clearInterval(interval);
    }, []);

    // Save bearer token to localStorage when it changes
    const handleTokenChange = (token: string) => {
        setBearerToken(token);
        localStorage.setItem('manage_bearer_token', token);
    };

    const handleToggleChange = () => {
        if (!isWithinServiceTime) {
            return; // Prevent change if not within service time
        }
        setIsSoldOut(!isSoldOut);
    };

    const handleUpdate = () => {
        // Mock implementation - show warning
        setModalMessage('이 기능은 아직 구현되지 않았습니다.');
        setModalType('error');
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ManageHeader bearerToken={bearerToken} onTokenChange={handleTokenChange} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Unsupported Feature Alert */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 font-semibold">
                                ⚠️ 미지원 기능
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                                이 기능은 현재 개발 중이며 아직 사용할 수 없습니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Service Time Warning */}
                {!isWithinServiceTime && (
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-orange-700 font-semibold">
                                    🕐 일품메뉴 서비스 시간(평일 11:30-13:30)에만 수정 가능합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Restaurant Selection */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">식당 선택</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setSelectedRestaurant('RESTAURANT_1')}
                            className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-200 ${selectedRestaurant === 'RESTAURANT_1'
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            제1 학생식당
                        </button>
                        <button
                            onClick={() => setSelectedRestaurant('RESTAURANT_2')}
                            className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-200 ${selectedRestaurant === 'RESTAURANT_2'
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            제2 학생식당
                        </button>
                    </div>
                </div>

                {/* Sold Out Toggle */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">일품 메뉴 상태</h3>

                    <div className="flex items-center justify-between max-w-md">
                        <div>
                            <p className="text-lg font-semibold text-gray-700">
                                {isSoldOut ? '매진' : '판매중'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                현재 일품 메뉴 상태
                            </p>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            onClick={handleToggleChange}
                            disabled={!isWithinServiceTime}
                            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${!isWithinServiceTime
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : isSoldOut
                                        ? 'bg-red-500 focus:ring-red-500'
                                        : 'bg-green-500 focus:ring-green-500'
                                }`}
                        >
                            <span
                                className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${isSoldOut ? 'translate-x-12' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            {isWithinServiceTime ? (
                                <>
                                    <span className="font-semibold text-green-600">✓ 수정 가능:</span> 현재 평일 서비스 시간입니다.
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold text-orange-600">✗ 수정 불가:</span> 평일 11:30-13:30에만 수정할 수 있습니다.
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Update Button (Disabled - Mock) */}
                <div className="flex justify-center">
                    <button
                        onClick={handleUpdate}
                        disabled={true}
                        className="bg-gray-400 text-white font-bold py-3 px-8 rounded-lg cursor-not-allowed shadow-lg"
                    >
                        저장 (미지원)
                    </button>
                </div>
            </main>

            {isMobile && <MobileFooter />}
            {!isMobile && <DesktopFooter />}

            {showModal && (
                <Modal
                    message={modalMessage}
                    type={modalType}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ManageSoldoutPage;
