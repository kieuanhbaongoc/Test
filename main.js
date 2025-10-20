// Initialize variables
let userId = null;
let userData = {
    limit: 60,
    weeklyData: Array(7).fill(0),
    appUsage: {},
    badges: {},
    completedActivities: {},
    customActivities: [],
    underLimitStreak: 0,
    learningStreak: 0,
    readingStreak: 0,
    exerciseStreak: 0,
    quizScores: { physical: 0, mental: 0, concentration: 0 },
    quizHistory: [],
    lastLoginDate: null,
    lastActivityDate: null,
    activityHistory: {}
};

const todayIndex = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
// SỬA LỖI: Tạo một chỉ số ngày mới phù hợp với biểu đồ (0=Mon, 1=Tue, ..., 6=Sun)
const chartDayIndex = (todayIndex + 6) % 7;

const socialApps = [
    { id: 'facebook', name: 'Facebook', color: '#1877f2', iconClass: 'fa-brands fa-facebook' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F', iconClass: 'fa-brands fa-instagram' },
    { id: 'tiktok', name: 'TikTok', color: '#000000', iconClass: 'fa-brands fa-tiktok' },
    { id: 'twitter', name: 'Twitter', color: '#1DA1F2', iconClass: 'fa-brands fa-x-twitter' },
    { id: 'threads', name: 'Threads', color: '#000000', iconClass: 'fa-brands fa-threads' },
    { id: 'youtube', name: 'YouTube', color: '#FF0000', iconClass: 'fa-brands fa-youtube' },
];

const defaultHealthyActivities = [
    { id: 'reading', name: 'Đọc sách 30 phút' },
    { id: 'exercise', name: 'Tập thể dục 15 phút' },
    { id: 'learning', name: 'Học tập 60 phút' },
    { id: 'music', name: 'Thư giãn với âm nhạc 10 phút' },
    { id: 'conversation', name: 'Trò chuyện trực tiếp' },
    { id: 'pre_sleep_tech_free', name: 'Không sử dụng điện thoại 30 phút trước khi ngủ' },
    { id: 'post_wake_tech_free', name: 'Không sử dụng mạng xã hội ngay khi vừa ngủ dậy' }
];

const allBadges = [
    { id: 'first_day', name: 'Ngày đầu tiên', description: 'Đăng nhập vào ứng dụng', icon: '☀️' },
    { id: 'under_limit_1', name: 'Kiểm soát tốt', description: 'Giữ thời gian dưới giới hạn trong 1 ngày', icon: '✅' },
    { id: 'under_limit_5', name: 'Chuỗi 5 ngày', description: 'Giữ thời gian dưới giới hạn trong 5 ngày liên tiếp', icon: '🏅' },
    { id: 'under_limit_10', name: 'Chuyên gia kỷ luật', description: 'Giữ thời gian dưới giới hạn trong 10 ngày liên tiếp', icon: '🥇' },
    { id: 'under_limit_20', name: 'Thống trị', description: 'Giữ thời gian dưới giới hạn trong 20 ngày liên tiếp', icon: '👑' },
    { id: 'first_activity', name: 'Hoạt động đầu tiên', description: 'Hoàn thành hoạt động lành mạnh đầu tiên', icon: '🌱' },
    { id: 'all_activities', name: 'Toàn năng', description: 'Hoàn thành tất cả hoạt động lành mạnh trong một ngày', icon: '🌟' },
    { id: 'quiz_pro', name: 'Chuyên gia sức khỏe', description: 'Hoàn thành bài kiểm tra sức khỏe', icon: '🧠' },
    { id: 'dependency_low_50', name: 'Tự chủ số', description: 'Điểm phụ thuộc dưới 50%', icon: '⚖️' },
    { id: 'dependency_low_40', name: 'Giải phóng', description: 'Điểm phụ thuộc dưới 40%', icon: '🕊️' },
    { id: 'dependency_low_30', name: 'Chủ nhân cuộc sống', description: 'Điểm phụ thuộc dưới 30%', icon: '🔮' },
    { id: 'learning_streak_5', name: 'Chuỗi học tập 5', description: 'Hoàn thành hoạt động học tập 5 ngày liên tiếp', icon: '📖' },
    { id: 'learning_streak_10', name: 'Chuỗi học tập 10', description: 'Hoàn thành hoạt động học tập 10 ngày liên tiếp', icon: '🎓' },
    { id: 'reading_streak_5', name: 'Chuỗi đọc sách 5', description: 'Hoàn thành hoạt động đọc sách 5 ngày liên tiếp', icon: '📕' },
    { id: 'reading_streak_10', name: 'Chuỗi đọc sách 10', description: 'Hoàn thành hoạt động đọc sách 10 ngày liên tiếp', icon: '📚' },
    { id: 'exercise_streak_5', name: 'Chuỗi tập thể dục 5', description: 'Hoàn thành hoạt động tập thể dục 5 ngày liên tiếp', icon: '💪' },
    { id: 'exercise_streak_10', name: 'Chuỗi tập thể dục 10', description: 'Hoàn thành hoạt động tập thể dục 10 ngày liên tiếp', icon: '🏋️' },
    { id: 'custom_activity', name: 'Sáng tạo', description: 'Thêm một hoạt động lành mạnh của riêng bạn', icon: '🎨' },
];

const quizQuestions = {
    physical: [
        { q: "Bạn có thường xuyên cảm thấy đau đầu, mỏi mắt, hoặc đau cổ, vai, gáy không?", score: [0, 1, 2, 3, 4] },
        { q: "Giấc ngủ của bạn có bị gián đoạn hoặc khó ngủ do sử dụng thiết bị điện tử không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có thường xuyên cảm thấy cơ thể mệt mỏi, uể oải ngay cả khi không làm việc nặng nhọc không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có cảm thấy khó khăn khi rời khỏi màn hình để tham gia các hoạt động thể chất không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có thường xuyên có những bữa ăn qua loa để tiếp tục lướt mạng không?", score: [0, 1, 2, 3, 4] },
    ],
    mental: [
        { q: "Bạn có thường xuyên cảm thấy lo lắng, căng thẳng hoặc dễ cáu gắt không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có cảm thấy áp lực phải thể hiện một hình ảnh hoàn hảo trên mạng không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có cảm thấy buồn bã hoặc trống rỗng khi không được lướt mạng không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có cảm thấy lo sợ mình sẽ bỏ lỡ các xu hướng, tin tức trên mạng xã hội không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có thấy mình dễ dàng so sánh bản thân với người khác trên mạng xã hội không?", score: [0, 1, 2, 3, 4] },
    ],
    concentration: [
        { q: "Bạn có dễ bị xao nhãng bởi điện thoại khi đang làm việc/học tập không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có kiểm tra điện thoại ngay khi nhận được thông báo không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có cảm thấy khó khăn khi phải tập trung vào một cuộc trò chuyện trực tiếp?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có thường bị gián đoạn khi đang thực hiện một nhiệm vụ không?", score: [0, 1, 2, 3, 4] },
        { q: "Bạn có thói quen sử dụng điện thoại khi đang đọc sách không?", score: [0, 1, 2, 3, 4] }, 
    ],
};

const quizOptions = ["Không bao giờ", "Hiếm khi", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"];

// Pomodoro Timer Variables
const pomodoro = {
    workDuration: 25 * 60, // 25 minutes in seconds
    breakDuration: 5 * 60, // 5 minutes in seconds
    timer: null,
    isWorkTime: true,
    isRunning: false,
    timeRemaining: 0,
    intervalId: null
};

// Countdown Timer Variables
let countdownInterval = null;
let currentHistoryDate = new Date();

// Initialize localStorage
function initLocalStorage() {
    if (!localStorage.getItem('userId')) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    } else {
        userId = localStorage.getItem('userId');
    }

    const savedData = localStorage.getItem('userData');
    if (savedData) {
        userData = JSON.parse(savedData);
        
        // Initialize activityHistory if it doesn't exist
        if (!userData.activityHistory) {
            userData.activityHistory = {};
            saveData();
        }
    } else {
        saveData();
    }
    
    // Check for activity reset
    checkActivityReset();
}

function saveData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Check if activities need to be reset (at 6:00 AM GMT+7)
function checkActivityReset() {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const lastResetDate = userData.lastResetDate || '';
    
    // Get current time in GMT+7
    const gmt7Hours = (now.getUTCHours() + 7) % 24;
    const gmt7Minutes = now.getUTCMinutes();
    
    // Check if it's 6:00 AM or later and we haven't reset today
    if (today !== lastResetDate && gmt7Hours >= 6) {
        // Save today's activities to history before reset
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        
        if (!userData.activityHistory[yesterdayStr]) {
            userData.activityHistory[yesterdayStr] = {};
        }
        
        // Save completed activities to history
        Object.keys(userData.completedActivities).forEach(activityId => {
            if (userData.completedActivities[activityId] === today) {
                userData.activityHistory[yesterdayStr][activityId] = true;
            }
        });
        
        // Check if user stayed under limit yesterday
        // SỬA LỖI: Logic này đã đúng vì nó cũng dùng cách tính tương tự
        const yesterdayIndex = (yesterday.getDay() + 6) % 7; // Convert to 0=Mon, 1=Tue, ..., 6=Sun
        const yesterdayUsage = userData.weeklyData[yesterdayIndex] || 0;
        const userLimit = userData.limit || 60;
        
        if (yesterdayUsage <= userLimit) {
            // Increment under limit streak
            userData.underLimitStreak = (userData.underLimitStreak || 0) + 1;
            
            // Award badges based on streak
            if (userData.underLimitStreak >= 1) awardBadge('under_limit_1');
            if (userData.underLimitStreak >= 5) awardBadge('under_limit_5');
            if (userData.underLimitStreak >= 10) awardBadge('under_limit_10');
            if (userData.underLimitStreak >= 20) awardBadge('under_limit_20');
            
            showNotification("Thành Tựu Mới!", `Bạn đã giữ thời gian sử dụng dưới giới hạn trong ${userData.underLimitStreak} ngày!`);
        } else {
            // Reset streak if over limit
            userData.underLimitStreak = 0;
        }
        
        // Reset completed activities
        userData.completedActivities = {};
        userData.lastResetDate = today;
        saveData();
        
        // Show notification
        showNotification("Reset Hoạt Động", "Hoạt động lành mạnh đã được reset cho ngày mới!");
    }

    // THAY ĐỔI MỚI: Reset dữ liệu hàng tuần vào 6h sáng thứ Hai
    const gmt7Day = (now.getUTCDay() + 7) % 7; // 0=Sun, 1=Mon, ..., 6=Sat
    if (gmt7Day === 1 && gmt7Hours >= 6 && userData.lastWeeklyResetDate !== today) {
        userData.weeklyData = Array(7).fill(0);
        userData.appUsage = {};
        userData.lastWeeklyResetDate = today;
        saveData();
        console.log("Dữ liệu hàng tuần đã được reset.");
    }
}

// Update countdown timer to 6:00 AM GMT+7
function updateCountdownTimer() {
    const now = new Date();
    
    // Get current time in GMT+7
    const gmt7Hours = (now.getUTCHours() + 7) % 24;
    const gmt7Minutes = now.getUTCMinutes();
    const gmt7Seconds = now.getUTCSeconds();
    
    // Calculate time until 6:00 AM GMT+7
    let hoursUntilReset = 0;
    let minutesUntilReset = 0;
    let secondsUntilReset = 0;
    
    if (gmt7Hours < 6) {
        // Current time is before 6:00 AM
        hoursUntilReset = 6 - gmt7Hours - 1;
        minutesUntilReset = 60 - gmt7Minutes - 1;
        secondsUntilReset = 60 - gmt7Seconds;
    } else {
        // Current time is after 6:00 AM, calculate until tomorrow
        hoursUntilReset = 24 - gmt7Hours + 6 - 1;
        minutesUntilReset = 60 - gmt7Minutes - 1;
        secondsUntilReset = 60 - gmt7Seconds;
    }
    
    // Format the time as HH:MM:SS
    const formattedTime = 
        String(hoursUntilReset).padStart(2, '0') + ':' +
        String(minutesUntilReset).padStart(2, '0') + ':' +
        String(secondsUntilReset).padStart(2, '0');
    
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        countdownElement.textContent = formattedTime;
    }
}

// Start countdown timer
function startCountdownTimer() {
    // Update immediately
    updateCountdownTimer();
    
    // Update every second
    countdownInterval = setInterval(updateCountdownTimer, 1000);
}

// Format date as dd/mm/yyyy
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Update activity history display
function updateActivityHistory() {
    const dateStr = currentHistoryDate.toISOString().slice(0, 10);
    const historyDateDisplay = document.getElementById('history-date-display');
    if (historyDateDisplay) {
        historyDateDisplay.textContent = formatDate(currentHistoryDate);
    }
    
    const allActivities = defaultHealthyActivities.concat(userData.customActivities || []);
    const completedActivities = userData.activityHistory[dateStr] || {};
    const activityHistoryContainer = document.getElementById('activity-history-container');
    
    if (activityHistoryContainer) {
        activityHistoryContainer.innerHTML = allActivities.map(activity => `
            <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <p class="text-gray-700">${activity.name}</p>
                <span class="px-4 py-1 rounded-full text-sm font-semibold 
                    ${completedActivities[activity.id] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}">
                    ${completedActivities[activity.id] ? 'Đã Xong' : 'Chưa làm'}
                </span>
            </div>
        `).join('');
    }
}

// Initialize app
function initApp() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const mainContent = document.getElementById('main-content');
    const surveyContent = document.getElementById('survey-content');
    
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
    if (surveyContent) surveyContent.classList.remove('hidden');

    if (document.getElementById('user-id-display')) {
        document.getElementById('user-id-display').textContent = userId;
        updateMainUI();
        startCountdownTimer();
    }
    
    if (document.getElementById('quiz-content')) {
        updateSurveyUI();
    }
}

// Update Main Page UI
function updateMainUI() {
    // Update dashboard
    // SỬA LỖI: Sử dụng chartDayIndex thay vì todayIndex
    const totalUsageToday = userData.weeklyData[chartDayIndex] || 0;
    const currentUsageDisplay = document.getElementById('current-usage-display');
    if(currentUsageDisplay) currentUsageDisplay.textContent = `${totalUsageToday}p`;
    
    const limit = userData.limit || 60;
    const limitInput = document.getElementById('limit-input');
    if(limitInput) limitInput.value = limit;
    
    const limitMessage = document.getElementById('limit-message');
    if(limitMessage) limitMessage.innerHTML = `Giới hạn: <strong>${limit}p</strong>`;

    const percentage = Math.min((totalUsageToday / limit) * 100, 100);
    const progressBar = document.getElementById('progress-bar');
    if(progressBar) progressBar.style.width = `${percentage}%`;

    if (totalUsageToday >= limit) {
        if(limitMessage) limitMessage.innerHTML = `<span class="font-bold text-red-300">Bạn đã vượt quá giới hạn!</span>`;
    } else if (totalUsageToday > 0) {
        if(limitMessage) limitMessage.innerHTML = `Còn lại: <strong>${Math.max(0, limit - totalUsageToday)}p</strong>`;
    }

    // Update app usage inputs
    const allApps = socialApps.concat(userData.customApps || []);
    const appInputContainer = document.getElementById('app-input-container');
    if(appInputContainer) {
        appInputContainer.innerHTML = allApps.map(app => `
            <div class="input-group">
                <div class="app-icon" style="background-color: ${app.color || '#ccc'}">
                    <i class="${app.iconClass || 'fa-solid fa-plus'}"></i>
                </div>
                <input type="number" id="input-${app.id}" placeholder="${app.name} (phút)" value="${(userData.appUsage[app.id] && userData.appUsage[app.id][chartDayIndex]) || 0}" class="flex-grow rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            </div>
        `).join('');
    }

    // Update activities
    const allActivities = defaultHealthyActivities.concat(userData.customActivities || []);
    const healthyActivitiesList = document.getElementById('healthy-activities-list');
    if(healthyActivitiesList) {
        healthyActivitiesList.innerHTML = allActivities.map(activity => `
            <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <p class="text-gray-700">${activity.name}</p>
                <button id="activity-${activity.id}" data-id="${activity.id}" class="complete-activity-btn px-4 py-1 rounded-full text-sm font-semibold transition duration-300
                    ${userData.completedActivities[activity.id] ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-indigo-200 text-indigo-700 hover:bg-indigo-300'}">
                    ${userData.completedActivities[activity.id] ? 'Đã Xong' : 'Hoàn Thành'}
                </button>
            </div>
        `).join('');
    }

    // Update badges
    const badgesGrid = document.getElementById('badges-grid');
    if(badgesGrid) {
        badgesGrid.innerHTML = allBadges.map(badge => `
            <div class="flex flex-col items-center space-y-2 p-3 rounded-xl bg-white shadow-sm transition-all transform hover:scale-105">
                <span class="text-4xl ${userData.badges[badge.id] ? 'badge-earned' : 'badge-icon'}">${badge.icon}</span>
                <p class="font-semibold text-center text-sm">${badge.name}</p>
                <p class="text-xs text-center text-gray-500">${badge.description}</p>
            </div>
        `).join('');
    }
   
    // Update charts
    updateCharts();
    
    // Update activity history
    updateActivityHistory();
}

// Update Survey Page UI
function updateSurveyUI() {
    // Nothing specific to initialize on survey page load
}

// Update Charts
function updateCharts() {
    const appUsageChartCtx = document.getElementById('app-usage-chart')?.getContext('2d');
    if (!appUsageChartCtx) return; // Exit if chart canvas is not on the page

    const appLabels = socialApps.map(app => app.name);
    const appColors = socialApps.map(app => app.color);
    const appData = socialApps.map(app => (userData.appUsage[app.id] || Array(7).fill(0)));

    const datasets = appData.map((data, index) => ({
        label: appLabels[index],
        data: data,
        borderColor: appColors[index],
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 5
    }));

    // Line chart for individual app usage
    if (window.appUsageChart) window.appUsageChart.destroy();
    window.appUsageChart = new Chart(appUsageChartCtx, {
        type: 'line',
        data: {
            // THAY ĐỔI MỚI: Sắp xếp lại trục X để liền mạch từ Thứ Hai đến Chủ Nhật
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Bar chart for total weekly usage
    const weeklyUsageChartCtx = document.getElementById('weekly-usage-chart')?.getContext('2d');
    if (!weeklyUsageChartCtx) return;

    if (window.weeklyUsageChart) window.weeklyUsageChart.destroy();
    const limitData = Array(7).fill(userData.limit || 60);
    window.weeklyUsageChart = new Chart(weeklyUsageChartCtx, {
        type: 'bar',
        data: {
            // THAY ĐỔI MỚI: Sắp xếp lại trục X để liền mạch
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            datasets: [
                {
                    label: 'Thời gian sử dụng',
                    data: userData.weeklyData,
                    backgroundColor: '#6366f1',
                },
                {
                    label: 'Giới hạn',
                    data: limitData,
                    type: 'line',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: { beginAtZero: true },
                x: { stacked: false }
            }
        }
    });
   
    // Quiz history chart
    const quizHistoryChartCtx = document.getElementById('quiz-history-chart')?.getContext('2d');
    if (quizHistoryChartCtx) {
        if (window.quizHistoryChart) window.quizHistoryChart.destroy();
        const historyLabels = userData.quizHistory.map((entry, index) => `Lần ${index + 1}`);
        const physicalData = userData.quizHistory.map(entry => entry.scores.physical);
        const mentalData = userData.quizHistory.map(entry => entry.scores.mental);
        const concentrationData = userData.quizHistory.map(entry => entry.scores.concentration);

        window.quizHistoryChart = new Chart(quizHistoryChartCtx, {
            type: 'line',
            data: {
                labels: historyLabels,
                datasets: [
                    { label: 'Thể chất', data: physicalData, borderColor: '#4c51bf', fill: false, tension: 0.4 },
                    { label: 'Tinh thần', data: mentalData, borderColor: '#6b46c1', fill: false, tension: 0.4 },
                    { label: 'Tập trung', data: concentrationData, borderColor: '#f56565', fill: false, tension: 0.4 }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, suggestedMax: 20 } }
            }
        });
    }
}

// Show notification
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification-card bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3 w-full max-w-sm fixed top-4 right-4 z-50 transform transition-all duration-500 translate-x-full';
    notification.innerHTML = `
        <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.912-2.316L17.726 5.86a2 2 0 00-1.912-1.684H8.186a2 2 0 00-1.912 1.684L4.02 17.684A2 2 0 006.012 20h11.976z" />
            </svg>
        </div>
        <div>
            <div class="font-bold text-gray-900">${title}</div>
            <div class="text-sm text-gray-600">${message}</div>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Award badge
function awardBadge(badgeId) {
    if (!userData.badges[badgeId]) {
        userData.badges[badgeId] = true;
        saveData();
        showNotification("Thành Tựu Mới!", `Bạn đã nhận được huy hiệu "${allBadges.find(b => b.id === badgeId).name}"!`);
    }
}

// Get quiz result evaluation
function getQuizResultEvaluation(scores) {
    const { physical, mental, concentration } = scores;
    
    // Tính điểm phụ thuộc cuối cùng để hiển thị
    const totalScore = physical + mental + concentration;
    const finalDependencyPercentage = (totalScore / 60) * 100;
    const formattedDependencyPercentage = finalDependencyPercentage.toFixed(2);
   
    let evaluationDetails = `
        <p><strong>Điểm phụ thuộc mạng xã hội của bạn là <span class="text-indigo-600 font-bold">${formattedDependencyPercentage}%</span>.</strong> Để hiểu rõ hơn về con số này, chúng ta hãy cùng phân tích chi tiết kết quả của bạn ở từng khía cạnh.</p>
        <div class="p-4 bg-white rounded-lg shadow-inner">
            <h5 class="font-bold text-lg mb-2">Phần 1: Phân tích chi tiết từng khía cạnh</h5>
            
            <h6 class="font-semibold text-md mb-2">Sức khỏe Thể chất (Physical)</h6>
            ${physical < 7 ? `
            <p class="mb-1">🟢 <strong>Mức độ: Đang ở mức tốt</strong> (Điểm: ${20 - physical}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Bạn đang duy trì được một nền tảng thể chất ổn định. Các biểu hiện tiêu cực như đau đầu, mỏi mắt hay rối loạn giấc ngủ do sử dụng thiết bị điện tử dường như không đáng kể. Điều này chứng tỏ bạn đã hình thành thói quen cân bằng giữa thời gian trước màn hình và hoạt động thể chất, giúp cơ thể có thời gian phục hồi năng lượng.<br>Đây là minh chứng cho sự tự điều chỉnh hành vi sử dụng công nghệ – một yếu tố quan trọng trong việc giảm thiểu ảnh hưởng của "dopamine loop" (vòng lặp dopamine) từ các nền tảng mạng xã hội.</p>
            ` : (physical < 15 ? `
            <p class="mb-1">🟡 <strong>Mức độ: Cần cải thiện</strong> (Điểm: ${20 - physical}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Sức khỏe thể chất của bạn đang có dấu hiệu giảm nhẹ do tác động từ việc sử dụng mạng xã hội. Các triệu chứng như mỏi mắt, căng cổ, hoặc rối loạn giấc ngủ có thể đang xuất hiện nhưng chưa nghiêm trọng. Cơ thể bạn đang gửi tín hiệu cảnh báo về sự quá tải cảm giác.<br>Hãy thiết lập "chu kỳ nghỉ kỹ thuật số" – cứ sau mỗi 20 phút sử dụng, hãy nhìn xa 20 giây (quy tắc 20-20-20), giãn cơ cổ, và hạn chế ánh sáng xanh vào ban đêm. Việc này giúp hệ thần kinh thị giác và cơ xương được tái tạo nhịp sinh học tự nhiên.</p>
            ` : `
            <p class="mb-1">🔴 <strong>Mức độ: Đang có vấn đề</strong> (Điểm: ${20 - physical}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Điểm số thấp cho thấy sức khỏe thể chất của bạn đang bị tổn hại rõ rệt. Tình trạng mệt mỏi, giảm thị lực, đau cơ hoặc mất ngủ có thể là hệ quả của việc tiếp xúc liên tục với kích thích số mà không có giai đoạn phục hồi.<br>Khi cơ thể rơi vào trạng thái này, não bộ sẽ tiết dopamine liên tục để duy trì cảm giác "hoạt động", dẫn đến mệt mỏi mãn tính và suy giảm thể lực. Đây là thời điểm bạn cần thiết lập giới hạn công nghệ cá nhân: giảm thời gian dùng mạng, tăng vận động thể chất và ưu tiên giấc ngủ chất lượng để khôi phục trạng thái cân bằng sinh học.</p>
            `)}

            <h6 class="font-semibold text-md mb-2 mt-4">Sức khỏe Tinh thần (Mental)</h6>
            ${mental < 7 ? `
            <p class="mb-1">🟢 <strong>Mức độ: Rất ổn định</strong> (Điểm: ${20 - mental}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Bạn đang sở hữu một trạng thái tâm lý vững vàng. Bạn ít bị chi phối bởi hiệu ứng "so sánh xã hội" (social comparison effect) và không quá lo lắng khi không cập nhật xu hướng mới. Điều này cho thấy bạn đã xây dựng được hàng rào nhận thức vững chắc trước các kích thích cảm xúc từ mạng xã hội – yếu tố nền tảng giúp duy trì cảm xúc tích cực và lòng tự trọng ổn định.<br>Đây là dấu hiệu của sức khỏe tinh thần kỹ thuật số (digital mental wellness), giúp bạn sử dụng công nghệ như công cụ phục vụ cuộc sống, chứ không phải để xác định giá trị bản thân.</p>
            ` : (mental < 15 ? `
            <p class="mb-1">🟡 <strong>Mức độ: Cần được quan tâm</strong> (Điểm: ${20 - mental}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Sức khỏe tinh thần của bạn đang ở mức dễ bị dao động. Việc lo lắng khi bị "bỏ lỡ" (FOMO) hoặc cảm thấy áp lực khi phải thể hiện bản thân trên mạng cho thấy dopamine từ các tương tác ảo đang ảnh hưởng đến vùng cảm xúc của não bộ.<br>Bạn nên dành thời gian tách khỏi môi trường mạng, viết nhật ký cảm xúc, hoặc tham gia các hoạt động mang tính kết nối thật như trò chuyện, đọc sách, hoặc học kỹ năng mới. Những hoạt động này giúp tái cân bằng hệ dopamine và củng cố cảm xúc tự nhiên thay vì phụ thuộc vào phản hồi ảo.</p>
            ` : `
            <p class="mb-1">🔴 <strong>Mức độ: Đang bị ảnh hưởng nghiêm trọng</strong> (Điểm: ${20 - mental}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Điểm số này cho thấy bạn đang trải qua mức độ căng thẳng hoặc lo âu cao liên quan đến việc sử dụng mạng xã hội. Cảm giác trống rỗng, mất tập trung, hoặc sợ bị lãng quên là dấu hiệu của dopamine burnout – khi não đã quen với việc được kích thích liên tục.<br>Lúc này, điều cần thiết là can thiệp cảm xúc tích cực: hạn chế tiếp xúc nội dung tiêu cực, nói chuyện với người thân hoặc tìm đến chuyên gia tâm lý để được hướng dẫn cách tái tạo năng lượng tinh thần và thoát khỏi sự phụ thuộc cảm xúc vào môi trường ảo.</p>
            `)}

            <h6 class="font-semibold text-md mb-2 mt-4">Mức độ Tập trung (Concentration)</h6>
            ${concentration < 7 ? `
            <p class="mb-1">🟢 <strong>Mức độ: Rất tốt</strong> (Điểm: ${20 - concentration}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Bạn có khả năng duy trì sự tập trung bền vững, phản ánh việc não bộ hoạt động ở trạng thái kiểm soát chứ không bị cuốn vào dòng chảy thông tin liên tục. Đây là một dấu hiệu đáng quý trong thời đại kỹ thuật số, cho thấy bạn đang sử dụng dopamine một cách có ý thức – chỉ kích hoạt khi cần thiết cho học tập và công việc.<br>Hãy tiếp tục phát huy bằng cách duy trì khoảng thời gian "deep work" (làm việc sâu), nơi bạn loại bỏ hoàn toàn thông báo và tập trung tuyệt đối vào một nhiệm vụ.</p>
            ` : (concentration < 15 ? `
            <p class="mb-1">🟡 <strong>Mức độ: Cần rèn luyện thêm</strong> (Điểm: ${20 - concentration}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Bạn có khả năng tập trung ở mức chấp nhận được, nhưng vẫn dễ bị gián đoạn bởi các tín hiệu số như thông báo, tin nhắn hoặc video ngắn. Điều này là biểu hiện của não bộ đang bị tái huấn luyện sai cách – thường xuyên chuyển đổi nhiệm vụ, khiến khả năng duy trì sự chú ý giảm.<br>Hãy thử phương pháp Pomodoro (làm việc 25 phút, nghỉ 5 phút), đồng thời tắt toàn bộ thông báo không cần thiết để não bộ tái lập khả năng tập trung tự nhiên.</p>
            ` : `
            <p class="mb-1">🔴 <strong>Mức độ: Đang rất thấp</strong> (Điểm: ${20 - concentration}/20)</p>
            <p class="text-sm pl-4 mb-2 text-gray-600">Điểm thấp cho thấy khả năng kiểm soát chú ý đang bị rối loạn nghiêm trọng, thường đi kèm với việc liên tục chuyển đổi giữa các ứng dụng và nội dung. Đây là dấu hiệu của digital distraction syndrome – hội chứng phân tán chú ý do sử dụng mạng xã hội quá mức.<br>Hãy bắt đầu bằng việc thiết lập vùng không công nghệ (no-screen zone) trong ngày, ví dụ như 30 phút sau khi thức dậy hoặc trước khi đi ngủ. Khi não bộ dần quen với "khoảng lặng thông tin", mức dopamine sẽ ổn định và khả năng tập trung sẽ được phục hồi.</p>
            `)}
        </div>
        
        <div class="p-4 bg-white rounded-lg shadow-inner mt-4">
            <h5 class="font-bold text-lg mb-2">Phần 2: Lời khuyên Tổng thể</h5>
            ${finalDependencyPercentage <= 30 ? `
            <p class="mb-1">🟢 <strong>Mức độ phụ thuộc thấp</strong></p>
            <p class="text-sm pl-4 text-gray-600">Bạn đang làm rất tốt. Điểm số cao thể hiện bạn đã đạt đến trạng thái tự chủ kỹ thuật số – sử dụng công nghệ như công cụ hỗ trợ, không phải nguồn dopamine chính.<br>Hãy duy trì thói quen lành mạnh này bằng cách thường xuyên "detox thông tin": tạm rời xa mạng xã hội 1 ngày mỗi tuần, dành thời gian cho thiên nhiên, sáng tạo, và tương tác thật. Đây là cách tốt nhất để duy trì sự tự do tinh thần trong kỷ nguyên số.</p>
            ` : (finalDependencyPercentage <= 60 ? `
            <p class="mb-1">🟡 <strong>Mức độ phụ thuộc trung bình</strong></p>
            <p class="text-sm pl-4 text-gray-600">Bạn đang ở giai đoạn chuyển tiếp giữa thói quen và nhận thức. Mức độ phụ thuộc ở mức vừa phải, cho thấy bạn đã bắt đầu kiểm soát được thói quen, nhưng đôi khi vẫn để mạng xã hội ảnh hưởng cảm xúc.<br>Hãy xây dựng lịch sử dụng mạng có mục đích: chỉ truy cập khi cần, giới hạn thời gian, và ưu tiên hoạt động ngoại tuyến. Việc này giúp não bộ tái học cách tìm niềm vui từ thế giới thật.</p>
            ` : `
            <p class="mb-1">🔴 <strong>Mức độ phụ thuộc cao</strong></p>
            <p class="text-sm pl-4 text-gray-600">Điểm số cho thấy mạng xã hội đang chi phối đáng kể hành vi và cảm xúc của bạn. Dù bạn có thể vẫn duy trì sức khỏe tốt, nhưng não bộ đã quen với việc tìm kiếm kích thích tức thời.<br>Hãy bắt đầu bằng việc giảm 10% thời gian sử dụng mỗi tuần, thay thế bằng các hoạt động mang lại dopamine tự nhiên: vận động, nghe nhạc, đọc sách hoặc giao tiếp thật. Đây là bước đầu của dopamine detox có kiểm soát, giúp khôi phục khả năng tập trung và sự tự chủ.</p>
            `)}
        </div>
    `;
   
    return {
        evaluationDetails,
        dependencyPercentage: finalDependencyPercentage, 
        finalAdvice: ''
    };
}

// Pomodoro Timer Functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function playBellSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
}

function startTimer() {
    pomodoro.isRunning = true;
    const startPauseBtn = document.getElementById('start-pause-btn');
    if(startPauseBtn) {
        startPauseBtn.textContent = 'Tạm Dừng';
        startPauseBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        startPauseBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
    }
    const resetBtn = document.getElementById('reset-btn');
    if(resetBtn) resetBtn.classList.remove('hidden');

    pomodoro.intervalId = setInterval(() => {
        pomodoro.timeRemaining--;
        const timerDisplay = document.getElementById('timer-display');
        if(timerDisplay) timerDisplay.textContent = formatTime(pomodoro.timeRemaining);

        if (pomodoro.timeRemaining <= 0) {
            playBellSound();
            const timerStatus = document.getElementById('timer-status');
            if (pomodoro.isWorkTime) {
                pomodoro.isWorkTime = false;
                pomodoro.timeRemaining = pomodoro.breakDuration;
                if(timerStatus) timerStatus.textContent = 'Giờ nghỉ!';
            } else {
                pomodoro.isWorkTime = true;
                pomodoro.timeRemaining = pomodoro.workDuration;
                if(timerStatus) timerStatus.textContent = 'Bắt đầu một chu kỳ mới!';
            }
            if(timerDisplay) timerDisplay.textContent = formatTime(pomodoro.timeRemaining);
        }
    }, 1000);
}

function pauseTimer() {
    pomodoro.isRunning = false;
    const startPauseBtn = document.getElementById('start-pause-btn');
    if(startPauseBtn) {
        startPauseBtn.textContent = 'Tiếp Tục';
        startPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        startPauseBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    }
    clearInterval(pomodoro.intervalId);
}

function resetTimer() {
    pauseTimer();
    pomodoro.isWorkTime = true;
    pomodoro.timeRemaining = pomodoro.workDuration;
    const timerDisplay = document.getElementById('timer-display');
    const timerStatus = document.getElementById('timer-status');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    if(timerDisplay) timerDisplay.textContent = formatTime(pomodoro.workDuration);
    if(timerStatus) timerStatus.textContent = 'Sẵn sàng bắt đầu!';
    if(startPauseBtn) {
        startPauseBtn.textContent = 'Bắt Đầu';
        startPauseBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        startPauseBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    }
    if(resetBtn) resetBtn.classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage
    initLocalStorage();
    
    // Initialize app
    initApp();
    
    // Navigation buttons
    document.getElementById('go-to-survey-btn')?.addEventListener('click', () => {
        window.location.href = 'survey.html';
    });
    
    document.getElementById('back-to-main-btn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    document.getElementById('back-to-main-after-quiz')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Main page event listeners
    document.getElementById('set-limit-btn')?.addEventListener('click', async () => {
        const limitInput = document.getElementById('limit-input');
        const newLimit = parseInt(limitInput?.value, 10);
        if (!isNaN(newLimit) && newLimit > 0) {
            userData.limit = newLimit;
            saveData();
            showNotification("Giới hạn đã được đặt", `Giới hạn hàng ngày của bạn đã được đặt là ${newLimit} phút.`);
            updateMainUI();
        }
    });

    document.getElementById('submit-usage-btn')?.addEventListener('click', async () => {
        let totalUsage = 0;
        socialApps.forEach(app => {
            const input = document.getElementById(`input-${app.id}`);
            const value = parseInt(input?.value, 10) || 0;
            if (!userData.appUsage[app.id]) userData.appUsage[app.id] = Array(7).fill(0);
            userData.appUsage[app.id][chartDayIndex] = value; // SỬA LỖI: dùng chartDayIndex
            totalUsage += value;
        });

        userData.weeklyData[chartDayIndex] = totalUsage; // SỬA LỖI: dùng chartDayIndex
        saveData();
        showNotification("Cập nhật thành công", `Tổng thời gian sử dụng hôm nay là ${totalUsage} phút.`);
        updateMainUI();
    });

    document.getElementById('add-activity-btn')?.addEventListener('click', async () => {
        const newActivityInput = document.getElementById('new-activity-input');
        const newActivityName = newActivityInput?.value.trim();
        if (newActivityName) {
            const newActivityId = newActivityName.replace(/\s+/g, '_').toLowerCase();
            const newActivity = { id: newActivityId, name: newActivityName };
            userData.customActivities = userData.customActivities || [];
            userData.customActivities.push(newActivity);
            saveData();
            if(newActivityInput) newActivityInput.value = '';
            showNotification("Hoạt động mới", "Bạn đã thêm một hoạt động lành mạnh mới!");
            awardBadge('custom_activity');
            updateMainUI();
        }
    });

    document.addEventListener('click', async (e) => {
        if (e.target.matches('.complete-activity-btn')) {
            const activityId = e.target.dataset.id;
            const activityName = defaultHealthyActivities.find(a => a.id === activityId)?.name || userData.customActivities.find(a => a.id === activityId)?.name;
            
            // Check if already completed today
            const today = new Date().toISOString().slice(0, 10);
            if (userData.completedActivities[activityId] === today) {
                return; // Already completed today
            }
            
            // Mark activity as completed
            userData.completedActivities[activityId] = today;
            
            // Also save to today's activity history
            if (!userData.activityHistory[today]) {
                userData.activityHistory[today] = {};
            }
            userData.activityHistory[today][activityId] = true;
            
            saveData();

            awardBadge('first_activity');
            const allActivitiesCompleted = [...defaultHealthyActivities, ...(userData.customActivities || [])].every(activity => userData.completedActivities[activity.id]);
            if (allActivitiesCompleted) {
                awardBadge('all_activities');
            }
           
            const lastDate = userData.lastActivityDate;
            const isSequential = (lastDate && (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24) === 1);
           
            if (activityId.includes('reading')) {
                userData.readingStreak = isSequential ? (userData.readingStreak || 0) + 1 : 1;
                if (userData.readingStreak >= 5) awardBadge('reading_streak_5');
                if (userData.readingStreak >= 10) awardBadge('reading_streak_10');
            }
            if (activityId.includes('exercise')) {
                userData.exerciseStreak = isSequential ? (userData.exerciseStreak || 0) + 1 : 1;
                if (userData.exerciseStreak >= 5) awardBadge('exercise_streak_5');
                if (userData.exerciseStreak >= 10) awardBadge('exercise_streak_10');
            }
            if (activityId.includes('learning')) {
                userData.learningStreak = isSequential ? (userData.learningStreak || 0) + 1 : 1;
                if (userData.learningStreak >= 5) awardBadge('learning_streak_5');
                if (userData.learningStreak >= 10) awardBadge('learning_streak_10');
            }
           
            userData.lastActivityDate = today;
            saveData();
            updateMainUI();
        }
    });

    // Activity history navigation
    document.getElementById('prev-day-btn')?.addEventListener('click', () => {
        currentHistoryDate.setDate(currentHistoryDate.getDate() - 1);
        updateActivityHistory();
    });

    document.getElementById('next-day-btn')?.addEventListener('click', () => {
        const today = new Date();
        if (currentHistoryDate < today) {
            currentHistoryDate.setDate(currentHistoryDate.getDate() + 1);
            updateActivityHistory();
        }
    });

    // Pomodoro Timer
    document.getElementById('start-pause-btn')?.addEventListener('click', () => {
        if (pomodoro.timeRemaining <= 0) {
            pomodoro.timeRemaining = pomodoro.workDuration;
            const timerStatus = document.getElementById('timer-status');
            if(timerStatus) timerStatus.textContent = 'Giờ làm việc!';
        }
        if (pomodoro.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    document.getElementById('reset-btn')?.addEventListener('click', resetTimer);

    // Survey page event listeners
    document.getElementById('start-quiz-btn')?.addEventListener('click', () => {
        const generateQuiz = (containerId, questions) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = questions.map((q, index) => `
                <div class="quiz-question" data-category="${containerId}" data-index="${index}">
                    <p class="font-medium">${index + 1}. ${q.q}</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                        ${quizOptions.map((option, optIndex) => `
                            <button data-score="${q.score[optIndex]}" class="quiz-option bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300 hover:bg-gray-100 transition duration-300">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('');
            container.classList.remove('hidden');
        };

        generateQuiz('physical-questions', quizQuestions.physical);
        generateQuiz('mental-questions', quizQuestions.mental);
        generateQuiz('concentration-questions', quizQuestions.concentration);

        const startQuizBtn = document.getElementById('start-quiz-btn');
        const submitQuizBtn = document.getElementById('submit-quiz-btn');
        const quizStatus = document.getElementById('quiz-status');

        if(startQuizBtn) startQuizBtn.classList.add('hidden');
        if(submitQuizBtn) submitQuizBtn.classList.remove('hidden');
        if(quizStatus) quizStatus.textContent = 'Hãy trả lời tất cả các câu hỏi để xem kết quả.';
    });

    document.getElementById('submit-quiz-btn')?.addEventListener('click', async () => {
        const allQuestions = document.querySelectorAll('.quiz-question');
        let answeredCount = 0;
        let scores = { physical: 0, mental: 0, concentration: 0 };

        allQuestions.forEach(q => {
            const selected = q.querySelector('.quiz-option.bg-indigo-500');
            if (selected) {
                const category = q.dataset.category.replace('-questions', '');
                scores[category] += parseInt(selected.dataset.score, 10);
                answeredCount++;
            }
        });

        if (answeredCount === allQuestions.length) {
            const evaluation = getQuizResultEvaluation(scores);
           
            const quizEvaluationEl = document.getElementById('quiz-evaluation');
            if(quizEvaluationEl) quizEvaluationEl.innerHTML = evaluation.evaluationDetails;

            const dependencyScoreEl = document.getElementById('dependency-score');
            if(dependencyScoreEl) {
                dependencyScoreEl.textContent = `Điểm phụ thuộc: ${evaluation.dependencyPercentage.toFixed(2)}%`;
            }

            const today = new Date().toISOString().slice(0, 10);
            userData.quizHistory.push({ date: today, scores: scores });
            saveData();

            const quizResultSection = document.getElementById('quiz-result-section');
            const quizStatus = document.getElementById('quiz-status');
            const submitQuizBtn = document.getElementById('submit-quiz-btn');

            if(quizResultSection) quizResultSection.classList.remove('hidden');
            if(quizStatus) quizStatus.classList.add('hidden');
            if(submitQuizBtn) submitQuizBtn.classList.add('hidden');
            
            awardBadge('quiz_pro');
           
            const dependencyPercentage = evaluation.dependencyPercentage;
            if (dependencyPercentage < 50) awardBadge('dependency_low_50');
            if (dependencyPercentage < 40) awardBadge('dependency_low_40');
            if (dependencyPercentage < 30) awardBadge('dependency_low_30');

            const quizChartCanvas = document.getElementById('quiz-chart');
            if (quizChartCanvas) {
                if (window.quizChart) window.quizChart.destroy();
                window.quizChart = new Chart(quizChartCanvas.getContext('2d'), {
                    type: 'radar',
                    data: {
                        labels: ['Thể chất', 'Tinh thần', 'Tập trung'],
                        datasets: [{
                            label: 'Điểm sức khỏe kỹ thuật số (càng cao càng tốt)',
                            data: [20 - scores.physical, 20 - scores.mental, 20 - scores.concentration],
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            borderColor: '#6366f1',
                            borderWidth: 2,
                            pointBackgroundColor: '#6366f1'
                        }]
                    },
                    options: {
                        responsive: true,
                        elements: { line: { borderWidth: 3 } },
                        scales: { r: { suggestedMin: 0, suggestedMax: 20, pointLabels: { font: { size: 14 } } } }
                    }
                });
            }
           
            updateCharts();
        } else {
            const quizStatus = document.getElementById('quiz-status');
            if(quizStatus) {
                quizStatus.textContent = 'Vui lòng trả lời tất cả các câu hỏi.';
            }
        }
    });

    document.getElementById('quiz-content')?.addEventListener('click', (e) => {
        if (e.target.matches('.quiz-option')) {
            const parent = e.target.closest('.quiz-question');
            parent.querySelectorAll('.quiz-option').forEach(btn => {
                btn.classList.remove('bg-indigo-500', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700');
            });
            e.target.classList.add('bg-indigo-500', 'text-white');
            e.target.classList.remove('bg-white', 'text-gray-700');
        }
    });

    // THÊM MỚI: Event Listener cho nút lưu biểu đồ tuần (ĐÃ CẬP NHẬT ĐỘ PHÂN GIẢI)
    document.getElementById('save-weekly-chart-btn')?.addEventListener('click', () => {
        if (window.weeklyUsageChart) {
            try {
                // CẬP NHẬT: Tăng độ phân giải lên 2x
                const imageBase64 = window.weeklyUsageChart.toBase64Image({ scale: 2 });
                
                // Tạo một thẻ <a> tạm thời để tải file
                const link = document.createElement('a');
                link.href = imageBase64;
                
                // Tạo tên file có ngày tháng
                const today = new Date().toISOString().slice(0, 10);
                link.download = `bieu-do-tuan-${today}.png`;
                
                // Kích hoạt động việc tải về
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification("Thành công!", "Biểu đồ tuần đã được lưu thành công.");
            } catch (error) {
                console.error("Lỗi khi lưu biểu đồ:", error);
                showNotification("Lỗi", "Không thể lưu biểu đồ. Vui lòng thử lại.");
            }
        } else {
            showNotification("Lỗi", "Biểu đồ chưa sẵn sàng để lưu.");
        }
    });

    // ===== THÊM MỚI: Event Listener cho nút lưu biểu đồ ứng dụng =====
    document.getElementById('save-app-chart-btn')?.addEventListener('click', () => {
        if (window.appUsageChart) {
            try {
                // TĂNG ĐỘ PHÂN GIẢI: Thêm { scale: 2 } để ảnh rõ nét hơn
                const imageBase64 = window.appUsageChart.toBase64Image({ scale: 2 });
                
                const link = document.createElement('a');
                link.href = imageBase64;
                
                const today = new Date().toISOString().slice(0, 10);
                link.download = `bieu-do-theo-ung-dung-${today}.png`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification("Thành công!", "Biểu đồ sử dụng theo ứng dụng đã được lưu.");
            } catch (error) {
                console.error("Lỗi khi lưu biểu đồ:", error);
                showNotification("Lỗi", "Không thể lưu biểu đồ. Vui lòng thử lại.");
            }
        } else {
            showNotification("Lỗi", "Biểu đồ chưa sẵn sàng để lưu.");
        }
    });
    // ===== KẾT THÚC ĐOẠN CODE THÊM VÀO =====

    // Initialize badges on first visit
    if (Object.keys(userData.badges).length === 0) {
        awardBadge('first_day');
    }
});
