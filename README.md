# Productivity Companion App

A cozy web application combining a Pomodoro timer and flashcard system to boost productivity and learning. Built with vanilla JavaScript, HTML, and CSS, featuring multiple themes, persistent storage, and audio notifications.

## What the App Does

This app has two main features:

1. **Pomodoro Timer** (`timer.html`): A productivity timer that alternates between work sessions (default 25 minutes) and breaks (default 5 minutes). It tracks completed sessions, shows history, and provides audio/visual alerts. Users can customize session lengths and choose from multiple themes.

2. **Flashcards** (`index.html`): A study tool with 9 decks for organizing flashcards. Users can add front/back cards, navigate through decks, flip cards, and switch between decks. All data persists across browser sessions.

Both pages share a unified design with theme switching and local storage for settings.

## How to Run It

1..... 

## Stretch Concepts Integration

The app integrates several advanced web development concepts beyond basic functionality:

1. **localStorage API** - Persists user settings, timer state, and flashcard data across browser sessions. Located in `saveState()`, `loadState()`, `saveFlashcards()`, and `loadFlashcards()` functions in `js/main.js`. Ensures users don't lose progress on page refresh.

2. **Audio API** - Generates beep sounds for timer alerts using Web Audio API oscillators. Located in `playAlarm()` function in `js/main.js`. Provides immediate audio feedback without external files.

3. **Notifications API** - Shows browser notifications when timer sessions end, even if the tab is not active. Located in `playNotification()` function in `js/main.js`. Keeps users informed during multitasking.

4. **CSS Custom Properties (Variables)** - Enables dynamic theming with 7 themes. Located in `:root` and theme classes (e.g., `.theme-mushroom`) in `css/style.css`, applied via `applyTheme()` in `js/main.js`. Allows runtime theme switching without JavaScript DOM manipulation.

5. **CSS Grid** - Creates responsive layouts for navigation and card controls. Located in `.parent` and `.bottom-nav` rules in `css/style.css`. Provides flexible, adaptive positioning.

6. **CSS 3D Transforms** - Implements card flip animations for flashcards. Located in `.div1.flipped` and `.card-back` rules in `css/style.css`. Adds engaging visual feedback for studying.

## Reflection on Process

Building this app was challenging but rewarding. One major issue was managing shared state between the timer and flashcard features in a single JavaScript file—initially, I had separate state objects that led to duplication and bugs. I fixed this by consolidating into one `state` object and using conditional rendering in `render()`, which made the code cleaner and easier to maintain.

Another hurdle was implementing the 3D card flip: the initial CSS transforms caused layout shifts. I resolved it by using `backface-visibility: hidden` and absolute positioning for card faces, ensuring smooth animations without disrupting the grid.

I learned the importance of early planning for shared components—starting with a unified architecture from the beginning would have saved refactoring time. Next time, I'd use a more modular approach with separate files for timer and flashcard logic, even if it means more imports.

Overall, integrating stretch concepts like localStorage and the Audio API deepened my understanding of browser APIs. The theming system was particularly satisfying, as it made the app feel polished and personalized. This project reinforced that clean architecture and user experience go hand-in-hand. 
