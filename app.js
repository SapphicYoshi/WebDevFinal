// Pomodoro Timer Variables
let timeLeft = 25 * 60;
let isRunning = false;
let isWorkSession = true;
let sessionsCompleted = 0;
let timerInterval = null;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;

// Flashcards Variables
let flashcards = [];
let currentCardIndex = 0;

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

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

const cardQuestionInput = document.getElementById('cardQuestion');
const cardAnswerInput = document.getElementById('cardAnswer');
const addCardBtn = document.getElementById('addCardBtn');
const flashcardEl = document.getElementById('flashcard');
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const cardCounter = document.getElementById('cardCounter');
const prevCardBtn = document.getElementById('prevCardBtn');
const nextCardBtn = document.getElementById('nextCardBtn');
const deleteCardBtn = document.getElementById('deleteCardBtn');
const shuffleCardsBtn = document.getElementById('shuffleCardsBtn');
const cardsList = document.getElementById('cardsList');
const cardContainer = document.getElementById('cardContainer');
const emptyState = document.getElementById('emptyState');

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

// ==================== FLASHCARD FUNCTIONS ====================

function addFlashcard() {
    const question = cardQuestionInput.value.trim();
    const answer = cardAnswerInput.value.trim();

    if (!question || !answer) {
        alert('Please fill in both question and answer');
        return;
    }

    flashcards.push({
        id: Date.now(),
        question: question,
        answer: answer
    });

    cardQuestionInput.value = '';
    cardAnswerInput.value = '';

    if (flashcards.length === 1) {
        currentCardIndex = 0;
    }

    updateFlashcardsDisplay();
    cardQuestionInput.focus();
}

function updateFlashcardsDisplay() {
    if (flashcards.length === 0) {
        cardContainer.style.display = 'none';
        emptyState.style.display = 'block';
        cardsList.innerHTML = '';
    } else {
        cardContainer.style.display = 'flex';
        emptyState.style.display = 'block';
        displayCurrentCard();
        updateCardsList();
    }
}

function displayCurrentCard() {
    if (flashcards.length === 0) return;

    const card = flashcards[currentCardIndex];
    cardFront.textContent = card.question;
    cardBack.textContent = card.answer;
    flashcardEl.classList.remove('flipped');
    cardCounter.textContent = `${currentCardIndex + 1} / ${flashcards.length}`;
}

function nextCard() {
    if (flashcards.length === 0) return;
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    displayCurrentCard();
}

function prevCard() {
    if (flashcards.length === 0) return;
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    displayCurrentCard();
}

function deleteCard() {
    if (flashcards.length === 0) return;

    flashcards.splice(currentCardIndex, 1);

    if (flashcards.length > 0) {
        currentCardIndex = Math.min(currentCardIndex, flashcards.length - 1);
    } else {
        currentCardIndex = 0;
    }

    updateFlashcardsDisplay();
}

function shuffleCards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentCardIndex = 0;
    updateFlashcardsDisplay();
}

function updateCardsList() {
    cardsList.innerHTML = '';
    flashcards.forEach((card, index) => {
        const li = document.createElement('li');
        li.className = `card-item ${index === currentCardIndex ? 'active' : ''}`;
        li.innerHTML = `
            <strong>${card.question}</strong>
            <small>${card.answer.substring(0, 50)}${card.answer.length > 50 ? '...' : ''}</small>
        `;
        li.addEventListener('click', () => {
            currentCardIndex = index;
            displayCurrentCard();
            updateCardsList();
        });
        cardsList.appendChild(li);
    });
}

function flipCard() {
    flashcardEl.classList.toggle('flipped');
}

// ==================== TAB SWITCHING ====================

function switchTab(tabName) {
    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ==================== EVENT LISTENERS ====================

// Timer Events
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
updateSettingsBtn.addEventListener('click', updateSettings);

// Flashcard Events
addCardBtn.addEventListener('click', addFlashcard);
cardQuestionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') cardAnswerInput.focus();
});
cardAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addFlashcard();
});

nextCardBtn.addEventListener('click', nextCard);
prevCardBtn.addEventListener('click', prevCard);
deleteCardBtn.addEventListener('click', deleteCard);
shuffleCardsBtn.addEventListener('click', shuffleCards);
flashcardEl.addEventListener('click', flipCard);

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = btn.getAttribute('data-tab');
        tabContents.forEach(content => content.classList.remove('active'));
        tabBtns.forEach(b => b.classList.remove('active'));

        document.getElementById(tabName).classList.add('active');
        btn.classList.add('active');
    });
});

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();
    updateSessionDisplay();
    updateFlashcardsDisplay();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});
