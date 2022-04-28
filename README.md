# About Mastermind Game

Mastermind Game is a web application built and implemented by Node, Express, React.js and Ant Design technologies. On the website, users (players) can see game rules, create a new game, play the game, and see the results. Moreover, users can choose the game level when starting a game and get hints when they need to! These extended features make this game more fun!

  ## Basic Features
- System generates 4-digits combination by calling API on random.org (https://www.random.org/integers)
- Players can create a new game and have 10 times to enter a 4 digits combination to guess. 
- System provides feedback based on the user's guesses.
- System provides detailed information during the game. E.g. user’s guess history, remaining guess times, etc.
- System shows the game result (won/lost) and correct combination when the game is ended. The correct combination won’t be available on the client side until the game is over.

## Extended Features
- **Game rules page (How to play page)** - users can check detailed information and learn how to play the game before they start it. It’s helpful for the first time players.
- **Game level selection** - users can select a game level - easy, medium, and hard to start a game. The number range of 4-digits combinations will be adjusted based on the user's selection. 
- **Hint supports** - users can choose to get hints during the game. Hint supports are different based on game level. Hints history is always available during the game.
- **Personalized UI** - allow user to enter his/her name and the system will show proper greeting.
- **Responsive UI** - The UI is responsive and supports both desktop and mobile screens.

# Tech Chosen for this project
For this game, I chose to use Web technologies to build it because Web allows users to see rich UI and play it on Desktop or mobile easily. Besides, considering development productivity, I chose Node, Express, React and Ant Design and these combined technologies helped me to build, run and implement this project easily. It’s also easier to set up and run this project in different systems (Mac, Windows, and Linux) compared to other technologies.

- **Node.js & NPM** - Javascript runtime engine & Node package manager. I used these to install node libraries, run, build and start the projects for server and client code. It allows me to maintain and run server and client code with the same command lines.
https://nodejs.org/en/

- **Express.js** - Node.js web application framework. I used it to build a Web server and API endpoints. It’s very lightweight and can be set up and run in any system (e.g. Windows, Mac, Linux) easily. 
https://expressjs.com/

- **React.js** - Javascript library for building UI. I used it to build Web client pages. It’s lightweight and allows me to build client routes, and pages easily. Also, it triggers UI changes when the data is changed (useState) so I could easily implement the dynamic UI.
https://reactjs.org/

- **Ant Design** - React UI library for building rich UI components. It supports responsive UI and nice styles. I used it to create client page layout, navigation bar, buttons, table, etc. Therefore, I didn’t spend much time implementing UI components and styles. It boosted my development productivity.

# Project design & architecture
- **Web front end server:** The server provides the web interface and related information for users to play the game.
- **Backend API server:** The server plays the main control center to host the games by providing the APIs below:
  1. Creating game API (Using random.org API to generate the random number)
  2. Guessing number API
  3. Providing hints API
- **Data layer:** Using db.json to save the information of the games.

![Layout](https://user-images.githubusercontent.com/99282632/165676819-3712e146-7567-43c8-a1c8-a4695e7ff070.jpg)

# Installation
### Prerequisites
- Make sure Node and NPM are installed on the computer. We can download both at https://nodejs.org (NPM is included in the Node installation)
- Make sure Git is installed on the computer. This is necessary for deploying our application. (We can get it at https://git-scm.com)
### Clone project
```
$ git clone https://github.com/DennisLyn/mastermind-game.git
```

### Install API Server (In the root of the project)
```
$ cd mastermind-game
```
```
$ npm install
```
### Start API Server
```
$ npm start
```
The API server will run and listen port 3001. (http://localhost:3001)

### Install web front end server  (In the root of the project)
Lauch another terminal to run the web front end server
```
$ cd mastermind-game
$ cd webserver
```
```
$ npm install
```
### Start web front end server
```
$ npm start
```
The web front end server will run and listen port 3000. (http://localhost:3000)

You can use web browser to browse the web site and play game now.

![Layout02](https://user-images.githubusercontent.com/99282632/165682514-bc0a0327-973a-440a-8a6b-6421b52cb4a3.jpg)

# Folder Structure
- **apiserver** folder : The folder includes API server programs and database json file.
- **webserver** folder : The folder includes all web front end files.
