import React, { useState, useRef, useEffect } from 'react';
import ManageHeader from './ManageHeader';
import Modal from '../Upload/Modal';
import { useMediaQuery } from 'react-responsive';
import MobileFooter from '../Mobile/MobileFooter';
import DesktopFooter from '../Desktop/DesktopFooter';

type RestaurantType = 'RESTAURANT_1' | 'RESTAURANT_2';
type MealType = 'BREAKFAST' | 'LUNCH_NORMAL' | 'LUNCH_SPECIAL' | 'DINNER';

const ManagePicturePage = () => {
    const [bearerToken, setBearerToken] = useState<string>('');
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType>('RESTAURANT_1');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedMeal, setSelectedMeal] = useState<MealType>('BREAKFAST');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'error'>('success');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMobile = useMediaQuery({ maxWidth: 639 });

    // Load bearer token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('manage_bearer_token');
        if (savedToken) {
            setBearerToken(savedToken);
        }

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    // Save bearer token to localStorage when it changes
    const handleTokenChange = (token: string) => {
        setBearerToken(token);
        localStorage.setItem('manage_bearer_token', token);
    };

    const mealLabels = {
        BREAKFAST: '조식',
        LUNCH_NORMAL: '중식',
        LUNCH_SPECIAL: '일품',
        DINNER: '석식',
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setImageFile(files[0]);
        }
    };

    const handleUpload = () => {
        // Mock implementation - show warning
        setModalMessage('이 기능은 아직 구현되지 않았습니다.');
        setModalType('error');
        setShowModal(true);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

                {/* Date and Meal Selection */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">날짜 및 식사 선택</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                날짜 *
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Meal Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                식사 *
                            </label>
                            <select
                                value={selectedMeal}
                                onChange={(e) => setSelectedMeal(e.target.value as MealType)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                {Object.entries(mealLabels).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">사진 업로드</h3>
                    <div
                        className="border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-lg p-8 text-center transition-colors cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <svg className="mx-auto h-12 w-12 text-blue-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-lg font-medium text-gray-700">사진을 드래그하거나 클릭하여 선택</p>
                        <p className="text-sm text-gray-500 mt-2">이미지 파일(.jpg, .png, .jpeg)</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {imageFile && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">{imageFile.name}</p>
                                <p className="text-sm text-gray-500">{formatFileSize(imageFile.size)}</p>
                            </div>
                            <button
                                onClick={() => setImageFile(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleUpload}
                        disabled={true}
                        className="bg-gray-400 text-white font-bold py-3 px-8 rounded-lg cursor-not-allowed shadow-lg"
                    >
                        업로드 (미지원)
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

export default ManagePicturePage;
