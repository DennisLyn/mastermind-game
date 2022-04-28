# About Mastermind Game

Mastermind Game is a web application built and implemented by Node, Express, React.js and Ant Design technologies. On the website, users (players) can see game rules, create a new game, play the game, and see the results. Moreover, users can choose the game level when starting a game and get hints when they need to! These extended features make this game more fun!

  ## Basic Features
- System generates 4-digits combination by calling API on random.org (https://www.random.org/integers)
- Players can create a new game and have 10 times to enter a 4 digits combination to guess. 
- System provides feedback based on the user's guesses.
- System provides detailed information during the game. E.g. user’s guess history, remaining guess times, etc.
- System shows the game result (won/lost) and correct combination when the game is ended. The correct combination won’t be available on the client side until the game is over.

## Extended Features
- Game rules page (How to play page) - users can check detailed information and learn how to play the game before they start it. It’s helpful for the first time players.
- Game level selection - users can select a game level - easy, medium, and hard to start a game. The number range of 4-digits combinations will be adjusted based on the user's selection. 
- Hint supports - users can choose to get hints during the game. Hint supports are different based on game level. Hints history is always available during the game.
- Personalized UI - allow user to enter his/her name and the system will show proper greeting.
- Responsive UI - The UI is responsive and supports both desktop and mobile screens.

# Tech Chosen for this project
For this game, I chose to use Web technologies to build it because Web allows users to see rich UI and play it on Desktop or mobile easily. Besides, considering development productivity, I chose Node, Express, React and Ant Design and these combined technologies helped me to build, run and implement this project easily. It’s also easier to set up and run this project in different systems (Mac, Windows and Linux) compared to other technologies.
