
## What the site does
1. **Pomodoro Timer** (`timer.html`): A productivity timer that alternates between work sessions (default 25 minutes) and breaks (default 5 minutes). It tracks completed sessions and shows history. people can customize session lengths and choose from multiple themes.

2. **Flashcards** (`index.html`): A study tool with 9 decks for organizing flashcards. People can add front/back cards, flip cards, and switch between decks. All data stays across browser sessions.

## Stretch Concepts 
1. **localStorage API** - Keeps settings, timer state, and flashcard data across browser sessions. Located in `saveState()`, `loadState()`, `saveFlashcards()`, and `loadFlashcards()` functions in `js/main.js`. Ensures progress isn't lost on page refresh.

2. **Notifications API** - Shows browser notifications when timer sessions end, even if the tab is not active. Located in `playNotification()` function in `js/main.js`. Keeps people informed during multitasking.
  
3. **CSS 3D Transforms** - Card flip animations for flashcards. Located in `.div1.flipped` and `.card-back` rules in `css/style.css`. Adds engaging visual for studying.

## Reflection on Process
1. Lucky:
Building this site was challenging but rewarding. One major issue was managing shared state between the timer and flashcard features in a single JavaScript file—initially, we had separate state objects that led to duplication and bugs. I fixed this by consolidating into one `state` object and using conditional rendering in `render()`, which made the code cleaner and easier to maintain. Another problem was implementing the 3D card flip: the initial CSS transforms caused layout shifts. We fixed it by using `backface-visibility: hidden` and absolute positioning for card faces, ensuring smooth animations without disrupting the grid. I learned the importance of early planning for shared components—starting with a unified architecture from the beginning would have saved refactoring time. Next time, I'd use a more modular approach with separate files for timer and flashcard logic, even if it means more imports. Overall, integrating stretch concepts like localStorage deepened my understanding of browser APIs. The theming system was really satisfying, and it made the site feel polished and personalized. This project reinforced that clean architecture and user experience go hand-in-hand.
