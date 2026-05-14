document.addEventListener('DOMContentLoaded', () => {
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

    const yesButton = document.getElementById('yes');
    const deckOptions = document.getElementById('deckOptions');
    const frontInput = document.getElementById('front');
    const backInput = document.getElementById('back');
    const card = document.getElementById('div1');
    const cardFront = document.querySelector('.card-front');
    const cardBack = document.querySelector('.card-back');
    const forwardBtn = document.getElementById('for');
    const reverseBtn = document.getElementById('rev');
    const flipBtn = document.getElementById('flip');

    const themes = {
        wildflower: 'Wildflower Meadow',
        mushroom: 'Mushroom Grove',
        linen: 'Vintage Linen',
        forest: 'Forest Nook',
        lavender: 'Lavender Cottage',
        midnight: 'Midnight Fern',
        moonlit: 'Moonlit Cottage',
    };

    const decks = {
        option1: { fronts: [], backs: [] },
        option2: { fronts: [], backs: [] },
        option3: { fronts: [], backs: [] },
        option4: { fronts: [], backs: [] },
        option5: { fronts: [], backs: [] },
        option6: { fronts: [], backs: [] },
        option7: { fronts: [], backs: [] },
        option8: { fronts: [], backs: [] },
        option9: { fronts: [], backs: [] },
    };

    let showingFront = true;
    let activeDeck = null;
    let activeIdx = 0;

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

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function formatTimestamp(date = new Date()) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    function updateTimerDisplay() {
        if (timeDisplay) {
            timeDisplay.textContent = formatTime(state.timeLeft);
        }
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

    function updateHistoryUI() {
        if (!sessionHistoryEl) return;

        sessionHistoryEl.innerHTML = '';
        state.sessionHistory.slice().reverse().forEach(entry => {
            const listItem = document.createElement('li');
            const text = document.createElement('span');
            text.textContent = entry;
            listItem.appendChild(text);
            sessionHistoryEl.appendChild(listItem);
        });
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

    function saveState() {
        if (!window.localStorage) return;
        const savedState = {
            workDuration: state.workDuration,
            breakDuration: state.breakDuration,
            sessionsCompleted: state.sessionsCompleted,
            isWorkSession: state.isWorkSession,
            timeLeft: state.timeLeft,
            sessionHistory: state.sessionHistory,
            theme: state.currentTheme,
        };
        localStorage.setItem('pomodoroData', JSON.stringify(savedState));
    }

    function loadState() {
        try {
            const savedData = JSON.parse(localStorage.getItem('pomodoroData'));
            if (!savedData) return;

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

    function loadSavedTheme() {
        try {
            const savedData = JSON.parse(localStorage.getItem('pomodoroData'));
            return savedData?.theme;
        } catch (error) {
            return null;
        }
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
            oscillator.onended = () => audioCtx.close();
        } catch (error) {
            console.error('Alarm sound failed to play:', error);
        }
    }

    function playNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(message);
        }
        console.log(message);
    }

    function addHistoryEntry(entry) {
        const timeMark = formatTimestamp();
        state.sessionHistory.push(`[${timeMark}] ${entry}`);
    }

    function startTimer() {
        if (state.isRunning) return;

        if (state.timeLeft === (state.isWorkSession ? state.workDuration : state.breakDuration)) {
            const startLabel = state.isWorkSession ? 'Work session started' : 'Break started';
            addHistoryEntry(startLabel);
        }

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
        const endedLabel = state.isWorkSession ? 'Work session ended' : 'Break ended';
        addHistoryEntry(endedLabel);

        state.isWorkSession = !state.isWorkSession;

        if (state.isWorkSession) {
            state.sessionsCompleted++;
            state.timeLeft = state.workDuration;
            addHistoryEntry('Work session started');
            playNotification('Break is over! Time to work!');
        } else {
            state.timeLeft = state.breakDuration;
            addHistoryEntry('Break started');
            playNotification('Good work! Time for a break!');
        }

        saveState();
        render();
        startTimer();
    }

    function showText(deck, idx) {
        if (!card || !cardFront || !cardBack) return;
        if (!deck || deck.fronts.length === 0) {
            cardFront.textContent = 'No cards in this deck';
            cardBack.textContent = '';
            card.classList.remove('flipped');
            return;
        }

        cardFront.textContent = deck.fronts[idx] || '';
        cardBack.textContent = deck.backs[idx] || '';
        card.classList.toggle('flipped', !showingFront);
    }

    function setActiveDeck(deckKey) {
        const deck = decks[deckKey];
        if (!deck || deck.fronts.length === 0) {
            if (cardFront) {
                cardFront.textContent = `No cards in ${deckKey.replace('option', 'Deck ')}`;
            }
            if (cardBack) {
                cardBack.textContent = '';
            }
            if (card) {
                card.classList.remove('flipped');
            }
            activeDeck = null;
            return;
        }

        activeDeck = deck;
        activeIdx = 0;
        showingFront = true;
        showText(activeDeck, activeIdx);
    }

    function attachDeckButton(buttonId, deckKey) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.addEventListener('click', () => setActiveDeck(deckKey));
    }

    function initTimerPage() {
        if (!startBtn && !pauseBtn && !resetBtn) return;

        loadState();
        render();

        startBtn?.addEventListener('click', startTimer);
        pauseBtn?.addEventListener('click', pauseTimer);
        resetBtn?.addEventListener('click', resetTimer);
        updateSettingsBtn?.addEventListener('click', () => {
            const workMinutes = parseInt(workTimeInput?.value, 10);
            const breakMinutes = parseInt(breakTimeInput?.value, 10);
            const selectedTheme = themeSelect?.value;

            if (!isNaN(workMinutes) && workMinutes > 0) {
                state.workDuration = workMinutes * 60;
            }
            if (!isNaN(breakMinutes) && breakMinutes > 0) {
                state.breakDuration = breakMinutes * 60;
            }
            if (selectedTheme) {
                state.currentTheme = selectedTheme;
            }

            state.timeLeft = state.isWorkSession ? state.workDuration : state.breakDuration;
            saveState();
            render();
        });
    }

    function initFlashcardPage() {
        if (!yesButton || !deckOptions || !frontInput || !backInput || !card) return;

        const savedTheme = loadSavedTheme();
        if (savedTheme) {
            applyTheme(savedTheme);
        }

        yesButton.addEventListener('click', () => {
            const selected = deckOptions.value;
            const front = frontInput.value.trim();
            const back = backInput.value.trim();

            if (!front || !back) {
                alert('Please fill out both sides!');
                return;
            }

            decks[selected].fronts.push(front);
            decks[selected].backs.push(back);

            frontInput.value = '';
            backInput.value = '';

            if (!activeDeck || activeDeck !== decks[selected]) {
                setActiveDeck(selected);
            } else {
                showText(activeDeck, activeIdx);
            }
        });

        attachDeckButton('buttonOne', 'option1');
        attachDeckButton('buttonTwo', 'option2');
        attachDeckButton('buttonThree', 'option3');
        attachDeckButton('buttonFour', 'option4');
        attachDeckButton('buttonFive', 'option5');
        attachDeckButton('buttonSix', 'option6');
        attachDeckButton('buttonSeven', 'option7');
        attachDeckButton('buttonEight', 'option8');
        attachDeckButton('buttonNine', 'option9');

        flipBtn?.addEventListener('click', () => {
            showingFront = !showingFront;
            if (activeDeck) {
                showText(activeDeck, activeIdx);
            }
        });

        forwardBtn?.addEventListener('click', () => {
            if (activeDeck && activeIdx < activeDeck.fronts.length - 1) {
                activeIdx++;
                showingFront = true;
                showText(activeDeck, activeIdx);
            }
        });

        reverseBtn?.addEventListener('click', () => {
            if (activeDeck && activeIdx > 0) {
                activeIdx--;
                showingFront = true;
                showText(activeDeck, activeIdx);
            }
        });
    }

    initTimerPage();
    initFlashcardPage();
});
