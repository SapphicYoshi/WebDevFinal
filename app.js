const state = {
    timeLeft: 25 * 60,
    isRunning: false,
    isWorkSession: true,
    sessionsCompleted: 0,
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    sessionHistory: [],
    currentTheme: 'wildflower',
};

let timerInterval = null;

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

function applyTheme(themeKey) {
    if (!themes[themeKey]) {
        themeKey = 'wildflower';
    }

    document.documentElement.classList.remove(...Object.keys(themes).map(key => `theme-${key}`));
    document.documentElement.classList.add(`theme-${themeKey}`);
    if (themeSelect) {
        themeSelect.value = themeKey;
    }
}

function render() {
    updateTimerDisplay();
    updateSessionDisplay();
    updateHistoryUI();

    if (workTimeInput) {
        workTimeInput.value = Math.floor(state.workDuration / 60);
    }
    if (breakTimeInput) {
        breakTimeInput.value = Math.floor(state.breakDuration / 60);
    }
    if (sessionsCompletedDisplay) {
        sessionsCompletedDisplay.textContent = state.sessionsCompleted;
    }
    if (themeSelect) {
        themeSelect.value = state.currentTheme;
    }
    if (startBtn) {
        startBtn.disabled = state.isRunning;
    }
    if (pauseBtn) {
        pauseBtn.disabled = !state.isRunning;
    }

    applyTheme(state.currentTheme);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    if (timeDisplay) {
        timeDisplay.textContent = formatTime(state.timeLeft);
    }
}

function startTimer() {
    if (state.isRunning) return;
    state.isRunning = true;
    render();

    timerInterval = setInterval(() => {
        state.timeLeft--;
        updateTimerDisplay();

        if (state.timeLeft === 0) {
            clearInterval(timerInterval);
            playAlarm();
            switchSession();
        }
    }, 1000);
}

function playAlarm() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = 750;
        gain.gain.value = 0.3;

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.2);
        oscillator.onended = () => {
            audioCtx.close();
        };
    } catch (error) {
        console.error('Alarm sound failed to play:', error);
    }
}

function pauseTimer() {
    state.isRunning = false;
    clearInterval(timerInterval);
    render();
}

function resetTimer() {
    clearInterval(timerInterval);
    state.isRunning = false;
    state.isWorkSession = true;
    state.timeLeft = state.workDuration;
    render();
    saveState();
}

function switchSession() {
    state.isWorkSession = !state.isWorkSession;

    if (state.isWorkSession) {
        state.sessionsCompleted++;
        state.timeLeft = state.workDuration;
        addHistoryEntry('Completed a work session');
        playNotification('Break is over! Time to work!');
    } else {
        state.timeLeft = state.breakDuration;
        addHistoryEntry('Started a break');
        playNotification('Good work! Time for a break!');
    }

    saveState();
    render();
    startTimer();
}

function updateSessionDisplay() {
    if (!sessionType) return;

    if (state.isWorkSession) {
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
            return;
        }

        state.workDuration = typeof savedData.workDuration === 'number' ? savedData.workDuration : state.workDuration;
        state.breakDuration = typeof savedData.breakDuration === 'number' ? savedData.breakDuration : state.breakDuration;
        state.sessionsCompleted = typeof savedData.sessionsCompleted === 'number' ? savedData.sessionsCompleted : state.sessionsCompleted;
        state.isWorkSession = typeof savedData.isWorkSession === 'boolean' ? savedData.isWorkSession : state.isWorkSession;
        state.timeLeft = typeof savedData.timeLeft === 'number'
            ? savedData.timeLeft
            : (state.isWorkSession ? state.workDuration : state.breakDuration);
        state.sessionHistory = Array.isArray(savedData.sessionHistory) ? savedData.sessionHistory : state.sessionHistory;
        state.currentTheme = typeof savedData.theme === 'string' ? savedData.theme : state.currentTheme;
    } catch (error) {
        console.error('Could not load saved pomodoro state:', error);
    }
}

function saveState() {
    const persistedState = {
        workDuration: state.workDuration,
        breakDuration: state.breakDuration,
        sessionsCompleted: state.sessionsCompleted,
        isWorkSession: state.isWorkSession,
        timeLeft: state.timeLeft,
        sessionHistory: state.sessionHistory,
        theme: state.currentTheme,
    };
    localStorage.setItem('pomodoroData', JSON.stringify(persistedState));
}

function updateHistoryUI() {
    if (!sessionHistoryEl) return;

    sessionHistoryEl.innerHTML = state.sessionHistory.length
        ? state.sessionHistory.map(entry => `
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

    state.sessionHistory.unshift(entry);
    if (state.sessionHistory.length > 10) {
        state.sessionHistory.length = 10;
    }

    saveState();
    render();
}

function updateSettings() {
    const newWorkTime = parseInt(workTimeInput.value);
    const newBreakTime = parseInt(breakTimeInput.value);

    if (newWorkTime > 0 && newBreakTime > 0) {
        state.workDuration = newWorkTime * 60;
        state.breakDuration = newBreakTime * 60;
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
        state.currentTheme = event.target.value;
        saveState();
        render();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    render();

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

