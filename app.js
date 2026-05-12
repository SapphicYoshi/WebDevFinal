// Pomodoro Timer Variables
let timeLeft = 25 * 60;
let isRunning = false;
let isWorkSession = true;
let sessionsCompleted = 0;
let timerInterval = null;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let sessionHistory = [];

// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const updateSettingsBtn = document.getElementById('updateSettingsBtn');
const themeSelect = document.getElementById('themeSelect');
const sessionType = document.getElementById('sessionType');
const sessionsCompletedDisplay = document.getElementById('sessionsCompeted');
const sessionHistoryEl = document.getElementById('sessionHistory');

const themes = {
    wildflower: 'Wildflower Meadow',
    mushroom: 'Mushroom Grove',
    linen: 'Vintage Linen',
    forest: 'Forest Nook',
    lavender: 'Lavender Cottage',
    midnight: 'Midnight Fern',
    moonlit: 'Moonlit Cottage',
};

let currentTheme = 'wildflower';

function applyTheme(themeKey) {
    if (!themes[themeKey]) {
        themeKey = 'wildflower';
    }

    currentTheme = themeKey;
    document.documentElement.classList.remove(...Object.keys(themes).map(key => `theme-${key}`));
    document.documentElement.classList.add(`theme-${themeKey}`);
    if (themeSelect) {
        themeSelect.value = themeKey;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timeDisplay.textContent = formatTime(timeLeft);
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            switchSession();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isWorkSession = true;
    timeLeft = workDuration;
    updateTimerDisplay();
    updateSessionDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    saveState();
}

function switchSession() {
    isWorkSession = !isWorkSession;

    if (isWorkSession) {
        sessionsCompleted++;
        sessionsCompletedDisplay.textContent = sessionsCompleted;
        addHistoryEntry('Completed a work session');
        timeLeft = workDuration;
        playNotification('Break is over! Time to work!');
    } else {
        addHistoryEntry('Started a break');
        timeLeft = breakDuration;
        playNotification('Good work! Time for a break!');
    }

    saveState();
    updateSessionDisplay();
    updateTimerDisplay();
    startTimer();
}

function updateSessionDisplay() {
    if (isWorkSession) {
        sessionType.textContent = 'Work Session';
        sessionType.style.background = '#fff3cd';
        sessionType.style.color = '#856404';
    } else {
        sessionType.textContent = 'Break Time';
        sessionType.style.background = '#d4edda';
        sessionType.style.color = '#155724';
    }
}

function playNotification(message) {
    console.log(message);
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message);
    }
}

function loadState() {
    try {
        const savedData = JSON.parse(localStorage.getItem('pomodoroData'));
        if (!savedData) {
            applyTheme(currentTheme);
            return;
        }

        workDuration = typeof savedData.workDuration === 'number' ? savedData.workDuration : workDuration;
        breakDuration = typeof savedData.breakDuration === 'number' ? savedData.breakDuration : breakDuration;
        sessionsCompleted = typeof savedData.sessionsCompleted === 'number' ? savedData.sessionsCompleted : sessionsCompleted;
        isWorkSession = typeof savedData.isWorkSession === 'boolean' ? savedData.isWorkSession : isWorkSession;
        timeLeft = typeof savedData.timeLeft === 'number'
            ? savedData.timeLeft
            : (isWorkSession ? workDuration : breakDuration);
        sessionHistory = Array.isArray(savedData.sessionHistory) ? savedData.sessionHistory : [];
        currentTheme = typeof savedData.theme === 'string' ? savedData.theme : currentTheme;

        workTimeInput.value = Math.floor(workDuration / 60);
        breakTimeInput.value = Math.floor(breakDuration / 60);
        sessionsCompletedDisplay.textContent = sessionsCompleted;
        applyTheme(currentTheme);
    } catch (error) {
        console.error('Could not load saved pomodoro state:', error);
        applyTheme(currentTheme);
    }
}

function saveState() {
    const state = {
        workDuration,
        breakDuration,
        sessionsCompleted,
        isWorkSession,
        timeLeft,
        sessionHistory,
        theme: currentTheme,
    };
    localStorage.setItem('pomodoroData', JSON.stringify(state));
}

function updateHistoryUI() {
    if (!sessionHistoryEl) return;

    sessionHistoryEl.innerHTML = sessionHistory.length
        ? sessionHistory.map(entry => `
            <li>
                <strong>${entry.title}</strong>
                <span>${entry.time}</span>
            </li>
        `).join('')
        : '<li>No history yet. Start a session to save progress.</li>';
}

function addHistoryEntry(title) {
    const entry = {
        title,
        time: new Date().toLocaleString(),
    };

    sessionHistory.unshift(entry);
    if (sessionHistory.length > 10) {
        sessionHistory.length = 10;
    }

    saveState();
    updateHistoryUI();
}

function updateSettings() {
    const newWorkTime = parseInt(workTimeInput.value);
    const newBreakTime = parseInt(breakTimeInput.value);

    if (newWorkTime > 0 && newBreakTime > 0) {
        workDuration = newWorkTime * 60;
        breakDuration = newBreakTime * 60;
        resetTimer();
        alert('Settings updated!');
    } else {
        alert('Please enter valid times');
    }
}


// Timer Events
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
updateSettingsBtn.addEventListener('click', updateSettings);
if (themeSelect) {
    themeSelect.addEventListener('change', (event) => {
        applyTheme(event.target.value);
        saveState();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateTimerDisplay();
    updateSessionDisplay();
    updateHistoryUI();

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

