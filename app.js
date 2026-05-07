// Pomodoro Timer Variables
let timeLeft = 25 * 60;
let isRunning = false;
let isWorkSession = true;
let sessionsCompleted = 0;
let timerInterval = null;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;

// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const updateSettingsBtn = document.getElementById('updateSettingsBtn');
const sessionType = document.getElementById('sessionType');
const sessionsCompletedDisplay = document.getElementById('sessionsCompeted');

// ==================== TIMER FUNCTIONS ====================

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
}

function switchSession() {
    isWorkSession = !isWorkSession;

    if (isWorkSession) {
        sessionsCompleted++;
        sessionsCompletedDisplay.textContent = sessionsCompleted;
        timeLeft = workDuration;
        playNotification('Break is over! Time to work!');
    } else {
        timeLeft = breakDuration;
        playNotification('Good work! Time for a break!');
    }

    updateSessionDisplay();
    updateTimerDisplay();
    startTimer();
}

function updateSessionDisplay() {
    if (isWorkSession) {
        sessionType.textContent = '🎯 Work Session';
        sessionType.style.background = '#fff3cd';
        sessionType.style.color = '#856404';
    } else {
        sessionType.textContent = '☕ Break Time';
        sessionType.style.background = '#d4edda';
        sessionType.style.color = '#155724';
    }
}

function playNotification(message) {
    console.log(message);
    // Optional: Add browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message);
    }
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

// ==================== EVENT LISTENERS ====================

// Timer Events
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
updateSettingsBtn.addEventListener('click', updateSettings);

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();
    updateSessionDisplay();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

python -m http.server 8000

