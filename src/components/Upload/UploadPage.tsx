import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import ManageHeader from '../Manage/ManageHeader';
import { useMediaQuery } from 'react-responsive';
import MobileFooter from '../Mobile/MobileFooter';
import DesktopFooter from '../Desktop/DesktopFooter';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RestaurantType = 'RESTAURANT_1' | 'RESTAURANT_2';
type MealType = 'Breakfast' | 'Lunch_1' | 'Lunch_2' | 'Dinner';
type UploadMethod = 'excel' | 'manual';

interface WeekData {
  [day: string]: {
    [meal in MealType]?: string; // Multi-line text with menu items
  };
}

const UploadPage = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType>('RESTAURANT_1');
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('excel');
  const [weekStartDate, setWeekStartDate] = useState<string>('');
  const [bearerToken, setBearerToken] = useState<string>('');
  const [weekExists, setWeekExists] = useState<boolean>(false);
  const [checkingWeek, setCheckingWeek] = useState<boolean>(false);

  // Excel upload states
  const [excelKoFile, setExcelKoFile] = useState<File | null>(null);
  const [excelEnFile, setExcelEnFile] = useState<File | null>(null);

  // Manual input data
  const [manualData, setManualData] = useState<WeekData>({});

  // UI states
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const isMobile = useMediaQuery({ maxWidth: 639 });

  // Load bearer token from localStorage and get next Monday as default
  useEffect(() => {
    const savedToken = localStorage.getItem('manage_bearer_token');
    if (savedToken) {
      setBearerToken(savedToken);
    }

    const today = dayjs();
    const dayOfWeek = today.day(); // 0 = Sunday, 1 = Monday, ...
    let nextMonday;

    if (dayOfWeek === 0) {
      // Sunday -> next day (Monday)
      nextMonday = today.add(1, 'day');
    } else if (dayOfWeek === 1) {
      // Already Monday -> use today
      nextMonday = today;
    } else {
      // Tuesday-Saturday -> find next Monday
      nextMonday = today.add(8 - dayOfWeek, 'day');
    }

    setWeekStartDate(nextMonday.format('YYYY-MM-DD'));
  }, []);

  // Check if week data already exists
  useEffect(() => {
    if (!weekStartDate) return;

    const checkWeekExists = async () => {
      setCheckingWeek(true);
      try {
        const restaurantId = selectedRestaurant.toLowerCase();
        const response = await axios.get(
          `${API_BASE_URL}/restaurants/${restaurantId}`,
          { params: { date: weekStartDate } }
        );

        // If we got data back, the week exists
        setWeekExists(response.data?.data?.meals_by_day?.length > 0);
      } catch (error) {
        // If 404 or error, week doesn't exist
        setWeekExists(false);
      } finally {
        setCheckingWeek(false);
      }
    };

    checkWeekExists();
  }, [weekStartDate, selectedRestaurant]);

  // Generate days for the selected restaurant
  const getDaysForRestaurant = () => {
    if (!weekStartDate) return [];

    const days = [];
    const daysCount = selectedRestaurant === 'RESTAURANT_1' ? 5 : 7;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayNamesKo = ['월', '화', '수', '목', '금', '토', '일'];

    for (let i = 0; i < daysCount; i++) {
      const date = dayjs(weekStartDate).add(i, 'day');
      days.push({
        date: date.format('YYYY-MM-DD'),
        dayName: dayNames[i],
        dayNameKo: dayNamesKo[i],
      });
    }

    return days;
  };

  // Handle bearer token change
  const handleTokenChange = (token: string) => {
    setBearerToken(token);
    localStorage.setItem('manage_bearer_token', token);
  };

  const mealTypes: MealType[] = ['Breakfast', 'Lunch_1', 'Lunch_2', 'Dinner'];
  const mealLabels = {
    Breakfast: '조식',
    Lunch_1: '중식 (일품)',
    Lunch_2: '중식 (일반)',
    Dinner: '석식',
  };

  // Handle manual input change
  const handleManualInputChange = (day: string, meal: MealType, value: string) => {
    setManualData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value,
      }
    }));
  };

  // Generate text format from manual input
  const generateTextFormat = (): string => {
    const days = getDaysForRestaurant();
    let text = `${selectedRestaurant}\n${weekStartDate}\n`;

    days.forEach(({ date, dayName }) => {
      const dayData = manualData[date];
      if (!dayData) return;

      mealTypes.forEach(meal => {
        const menuText = dayData[meal];
        if (menuText && menuText.trim()) {
          text += `\n${dayName} ${date}\n${meal}\n`;
          // Split by newlines and add each menu item
          const items = menuText.split('\n').filter(item => item.trim());
          items.forEach(item => {
            text += `${item.trim()}\n`;
          });
        }
      });
    });

    return text;
  };

  // Handle Excel file upload
  const handleExcelUpload = async () => {
    if (!excelKoFile || !excelEnFile) {
      setModalMessage('한글과 영어 엑셀 파일을 모두 업로드해주세요.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    if (!bearerToken.trim()) {
      setModalMessage('Bearer Token을 입력해주세요.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('excel_ko', excelKoFile);
      formData.append('excel_en', excelEnFile);

      const response = await axios.post(`${API_BASE_URL}/upload/excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${bearerToken}`,
        },
      });

      if (response.data.success) {
        setModalMessage(`✅ 업로드 성공!\n\n총 ${response.data.total_meals || 0}개의 식사가 저장되었습니다.`);
        setModalType('success');
        setShowModal(true);

        // Reset files
        setExcelKoFile(null);
        setExcelEnFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);

      let errorMsg = '업로드 중 오류가 발생했습니다.';
      if (error.response?.status === 401 || error.response?.status === 403) {
        errorMsg = '❌ 인증 실패\n\nBearer Token이 올바르지 않습니다.';
      } else if (error.response?.data?.error) {
        errorMsg = `❌ 업로드 실패\n\n${error.response.data.error}`;
      }

      setModalMessage(errorMsg);
      setModalType('error');
      setShowModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle manual text upload
  const handleManualUpload = async () => {
    if (!bearerToken.trim()) {
      setModalMessage('Bearer Token을 입력해주세요.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    // Check if any data is entered
    const hasData = Object.values(manualData).some(dayData =>
      Object.values(dayData).some(menuText => menuText && menuText.trim())
    );

    if (!hasData) {
      setModalMessage('최소 하나 이상의 메뉴를 입력해주세요.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    setIsUploading(true);
    try {
      const textData = generateTextFormat();

      const response = await axios.post(`${API_BASE_URL}/upload/text`, textData, {
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${bearerToken}`,
        },
      });

      if (response.data.success) {
        setModalMessage(`✅ 업로드 성공!\n\n총 ${response.data.total_meals || 0}개의 식사가 저장되었습니다.`);
        setModalType('success');
        setShowModal(true);

        // Reset manual data
        setManualData({});
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);

      let errorMsg = '업로드 중 오류가 발생했습니다.';
      if (error.response?.status === 401 || error.response?.status === 403) {
        errorMsg = '❌ 인증 실패\n\nBearer Token이 올바르지 않습니다.';
      } else if (error.response?.data?.error) {
        errorMsg = `❌ 업로드 실패\n\n${error.response.data.error}`;
      }

      setModalMessage(errorMsg);
      setModalType('error');
      setShowModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    if (uploadMethod === 'excel') {
      handleExcelUpload();
    } else {
      handleManualUpload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ManageHeader bearerToken={bearerToken} onTokenChange={handleTokenChange} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-md inline-flex">
            <button
              onClick={() => {
                setSelectedRestaurant('RESTAURANT_1');
                setUploadMethod('excel'); // Reset to excel for R1
              }}
              className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-200 ${selectedRestaurant === 'RESTAURANT_1'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
                }`}
            >
              제1 학생식당
            </button>
            <button
              onClick={() => {
                setSelectedRestaurant('RESTAURANT_2');
                setUploadMethod('manual'); // R2 only supports manual
              }}
              className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-200 ${selectedRestaurant === 'RESTAURANT_2'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
                }`}
            >
              제2 학생식당
            </button>
          </div>
        </div>

        {/* Week Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4">주차 선택</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주 시작일 (월요일) *
              </label>
              <input
                type="date"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {checkingWeek && (
              <p className="text-sm text-gray-500">주차 확인 중...</p>
            )}

            {weekExists && !checkingWeek && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      ⚠️ 해당 주차의 데이터가 이미 존재합니다. 업로드가 불가능합니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Method Tabs (Restaurant 1 only) */}
        {selectedRestaurant === 'RESTAURANT_1' && (
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-md inline-flex">
              <button
                onClick={() => setUploadMethod('excel')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${uploadMethod === 'excel'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                  }`}
              >
                엑셀 업로드
              </button>
              <button
                onClick={() => setUploadMethod('manual')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${uploadMethod === 'manual'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                  }`}
              >
                직접 입력
              </button>
            </div>
          </div>
        )}

        {/* Upload Content Area */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {uploadMethod === 'excel' && selectedRestaurant === 'RESTAURANT_1' ? (
            <ExcelUploadArea
              koFile={excelKoFile}
              enFile={excelEnFile}
              setKoFile={setExcelKoFile}
              setEnFile={setExcelEnFile}
            />
          ) : (
            <ManualInputArea
              days={getDaysForRestaurant()}
              mealTypes={mealTypes}
              mealLabels={mealLabels}
              manualData={manualData}
              onInputChange={handleManualInputChange}
            />
          )}
        </div>

        {/* Upload Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleUpload}
            disabled={isUploading || weekExists || !weekStartDate || !bearerToken.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform active:scale-95 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>업로드 중...</span>
              </>
            ) : (
              <span>식단 업로드</span>
            )}
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

// Excel Upload Area Component
const ExcelUploadArea = ({
  koFile,
  enFile,
  setKoFile,
  setEnFile,
}: {
  koFile: File | null;
  enFile: File | null;
  setKoFile: (file: File | null) => void;
  setEnFile: (file: File | null) => void;
}) => {
  const koInputRef = useRef<HTMLInputElement>(null);
  const enInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent, lang: 'ko' | 'en') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (lang === 'ko') setKoFile(files[0]);
      else setEnFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">엑셀 파일 업로드</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Korean File */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">한글 파일 *</h4>
          <div
            className="border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-lg p-6 text-center transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'ko')}
            onClick={() => koInputRef.current?.click()}
          >
            <svg className="mx-auto h-10 w-10 text-blue-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-base font-medium">파일을 드래그하거나 클릭</p>
            <p className="text-sm text-gray-500 mt-1">엑셀 파일(.xlsx, .xls)</p>
          </div>
          <input
            ref={koInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => e.target.files && setKoFile(e.target.files[0])}
            className="hidden"
          />
          {koFile && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{koFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(koFile.size)}</p>
              </div>
              <button
                onClick={() => setKoFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* English File */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">영어 파일 *</h4>
          <div
            className="border-2 border-dashed border-green-300 hover:border-green-400 rounded-lg p-6 text-center transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'en')}
            onClick={() => enInputRef.current?.click()}
          >
            <svg className="mx-auto h-10 w-10 text-green-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-base font-medium">파일을 드래그하거나 클릭</p>
            <p className="text-sm text-gray-500 mt-1">엑셀 파일(.xlsx, .xls)</p>
          </div>
          <input
            ref={enInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => e.target.files && setEnFile(e.target.files[0])}
            className="hidden"
          />
          {enFile && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{enFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(enFile.size)}</p>
              </div>
              <button
                onClick={() => setEnFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Manual Input Area Component
const ManualInputArea = ({
  days,
  mealTypes,
  mealLabels,
  manualData,
  onInputChange,
}: {
  days: Array<{ date: string; dayName: string; dayNameKo: string }>;
  mealTypes: MealType[];
  mealLabels: { [key in MealType]: string };
  manualData: WeekData;
  onInputChange: (day: string, meal: MealType, value: string) => void;
}) => {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">직접 입력</h3>
        <p className="text-sm text-gray-600 mt-2">
          메뉴를 한 줄에 하나씩 입력하세요 (엔터로 구분)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">식사</th>
              {days.map((day) => (
                <th key={day.date} className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {day.dayNameKo}<br />
                  <span className="text-xs text-gray-500">{day.date}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((meal) => (
              <tr key={meal}>
                <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">
                  {mealLabels[meal]}
                </td>
                {days.map((day) => (
                  <td key={`${day.date}-${meal}`} className="border border-gray-300 p-2">
                    <textarea
                      value={manualData[day.date]?.[meal] || ''}
                      onChange={(e) => onInputChange(day.date, meal, e.target.value)}
                      placeholder={`메뉴1\n메뉴2\n메뉴3`}
                      className="w-full min-h-[100px] px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
                      rows={4}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadPage;
