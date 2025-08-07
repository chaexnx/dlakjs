
const API_KEY = '20a0a86513644da9b0c24626250708';
const BASE_URL = 'https://api.weatherapi.com/v1';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');

// DOM 요소들
const locationName = document.getElementById('locationName');
const localTime = document.getElementById('localTime');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const weatherCondition = document.getElementById('weatherCondition');
const feelsLike = document.getElementById('feelsLike');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const errorText = document.getElementById('errorText');

// 날씨 상태 한국어 변환
const weatherConditions = {
    'Sunny': '맑음',
    'Clear': '맑음',
    'Partly cloudy': '구름 조금',
    'Cloudy': '흐림',
    'Overcast': '흐림',
    'Mist': '안개',
    'Patchy rain possible': '비 올 가능성',
    'Patchy snow possible': '눈 올 가능성',
    'Patchy sleet possible': '진눈깨비 가능성',
    'Patchy freezing drizzle possible': '얼어붙는 이슬비 가능성',
    'Thundery outbreaks possible': '천둥번개 가능성',
    'Blowing snow': '눈보라',
    'Blizzard': '블리자드',
    'Fog': '안개',
    'Freezing fog': '얼어붙는 안개',
    'Patchy light drizzle': '가벼운 이슬비',
    'Light drizzle': '이슬비',
    'Freezing drizzle': '얼어붙는 이슬비',
    'Heavy freezing drizzle': '강한 얼어붙는 이슬비',
    'Patchy light rain': '가벼운 비',
    'Light rain': '가벼운 비',
    'Moderate rain at times': '때때로 보통 비',
    'Moderate rain': '보통 비',
    'Heavy rain at times': '때때로 강한 비',
    'Heavy rain': '강한 비',
    'Light freezing rain': '가벼운 얼어붙는 비',
    'Moderate or heavy freezing rain': '보통에서 강한 얼어붙는 비',
    'Light sleet': '가벼운 진눈깨비',
    'Moderate or heavy sleet': '보통에서 강한 진눈깨비',
    'Patchy light snow': '가벼운 눈',
    'Light snow': '가벼운 눈',
    'Patchy moderate snow': '보통 눈',
    'Moderate snow': '보통 눈',
    'Patchy heavy snow': '강한 눈',
    'Heavy snow': '강한 눈',
    'Ice pellets': '얼음 알갱이',
    'Light rain shower': '가벼운 소나기',
    'Moderate or heavy rain shower': '보통에서 강한 소나기',
    'Torrential rain shower': '폭우성 소나기',
    'Light sleet showers': '가벼운 진눈깨비 소나기',
    'Moderate or heavy sleet showers': '보통에서 강한 진눈깨비 소나기',
    'Light snow showers': '가벼운 눈 소나기',
    'Moderate or heavy snow showers': '보통에서 강한 눈 소나기',
    'Patchy light rain with thunder': '천둥을 동반한 가벼운 비',
    'Moderate or heavy rain with thunder': '천둥을 동반한 보통에서 강한 비',
    'Patchy light snow with thunder': '천둥을 동반한 가벼운 눈',
    'Moderate or heavy snow with thunder': '천둥을 동반한 보통에서 강한 눈'
};

// 이벤트 리스너
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// 검색 처리 함수
async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('도시 이름을 입력해주세요.');
        return;
    }
    
    await getWeatherData(city);
}

// 날씨 데이터 가져오기
async function getWeatherData(city) {
    try {
        showLoading();
        
        const response = await fetch(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no&lang=ko`
        );
        
        if (!response.ok) {
            throw new Error('도시를 찾을 수 없습니다.');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message || '날씨 정보를 가져오는데 실패했습니다.');
    } finally {
        hideLoading();
    }
}

// 날씨 데이터 표시
function displayWeatherData(data) {
    const { location, current } = data;
    
    // 위치 정보
    locationName.textContent = `${location.name}, ${location.country}`;
    localTime.textContent = `현지 시간: ${formatTime(location.localtime)}`;
    
    // 현재 날씨
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    currentTemp.textContent = Math.round(current.temp_c);
    weatherCondition.textContent = weatherConditions[current.condition.text] || current.condition.text;
    feelsLike.textContent = Math.round(current.feelslike_c);
    
    // 상세 정보
    visibility.textContent = current.vis_km;
    humidity.textContent = current.humidity;
    windSpeed.textContent = Math.round(current.wind_kph);
    pressure.textContent = Math.round(current.pressure_mb);
    
    showWeatherInfo();
}

// 시간 포맷
function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// UI 상태 관리 함수들
function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showWeatherInfo() {
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
}

// 초기 로드 시 서울 날씨 표시
window.addEventListener('load', () => {
    cityInput.value = 'Seoul';
    getWeatherData('Seoul');
});
