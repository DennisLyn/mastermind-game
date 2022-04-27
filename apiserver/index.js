const express = require("express"); //Node.js web framework
const { writeFile, readFile } = require('fs');
const request = require('request');

const PORT = process.env.PORT || 3001;
const app = express();
const dbPath = '/db.json';
const digitNum = 4;

// For parsing and getting req.body data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const GAME_LEVEL_SETTING = {
  easy: {
    hintCount: digitNum,
    minNum: 0,
    maxNum: 7, 
  },
  medium: {
    hintCount: digitNum - 1,
    minNum: 0,
    maxNum: 8, 
  },
  hard: {
    hintCount: digitNum - 2,
    minNum: 0,
    maxNum: 9, 
  }
};
const MAX_ALLOW_GUESS_TIMES = 10;
const GAME_STATUS = {
  ongoing: 'ongoing',
  won: 'won',
  lost: 'lost'
};

/**
 * Handles incoming requests to create a game based on level, save data in db.json, and return game data to client
 * URL: POST /api/game
 * Response: A json format data with game detailed info
 *
 * Expected JSON body:
 * {level: "easy"}
 *
 * Example JSON response:
 * {"data":{"id":"game_1","gameSetting":{"hintCount":4,"minNum":0,"maxNum":7}}}
 * {"error": "Failed to read game data from DB."}
 */
app.post("/api/game", function(req, res) {
  readFile(__dirname + dbPath, (error, data) => {
    if (error) {
      res.status(500).send({error: 'Failed to read game data from DB.'});
      return;
    }

    const dbData = JSON.parse(data);
    const gamesCount = Object.keys(dbData)?.length;
    const newGameId = `game_${gamesCount? gamesCount+1 : 1}`;
    const randomAPIUrl='https://www.random.org/integers/';
    const gameLevel = req.body.level;
    const requestURL = `${randomAPIUrl}?num=${digitNum}&min=${GAME_LEVEL_SETTING[gameLevel].minNum}&max=${GAME_LEVEL_SETTING[gameLevel].maxNum}&col=1&base=10&format=plain&rnd=new`;
    
    // For user to guess. The number is gotten from: https://www.random.org/clients/http/api/
    request(requestURL, (error, response, body) => {
      if (error) {
        res.status(500).send({error: 'Failed to read the random number from random.org API.'});
        return;
      }

      console.log('body:', body.replace(/\n/g,'')); // The answer number on server console for debugging.
 
      const newGame = {
        id: newGameId, // Game id will be: 'game_1', 'game_2', 'game_3', etc
        level: req.body.level,
        randomNumber: body.replace(/\n/g,''), 
        guessContent: [],
        hintContent: [],
        remainingGuessTimes: MAX_ALLOW_GUESS_TIMES,
        gameSetting: GAME_LEVEL_SETTING[gameLevel],
        remainingHintTimes: GAME_LEVEL_SETTING[gameLevel].hintCount,
        hintCacheNumber: body.replace(/\n/g,''),
        status: GAME_STATUS.ongoing // value: null, 'won', 'lost'
      };
  
      dbData[newGameId] = newGame;

      // Write the new game information into the db json file.
      writeFile(__dirname + dbPath, JSON.stringify(dbData), (err) => {
        if (err) {
          res.status(500).send({error: 'Failed to write game data to DB'});
          return;
        }
  
        res.status(200).send({data: {id: newGameId, gameSetting: GAME_LEVEL_SETTING[gameLevel]}});
      });
    });
  });
});

/**
 * Handles incoming requests to process a guess and update data by game id. Return game result to client
 * URL: POST /api/game/:id/guess/:num
 * Response: A json format data with game detailed info
 *
 * Example JSON response:
 * {"data":{"id":"game_1", "level":"easy", "guessContent":[{"guess":"0000", "result": "Incorrect", "updated": 1650187228229}], "remainingGuessTimes": 9, "status": "going"}}
 */
 app.post("/api/game/:id/guess/:num", (req, res) => {
  const gameId = req.params.id;
  const userGuess = req.params.num;

  if(!(gameId && userGuess)) {
    res.status(400).send({error: 'Game id and a guess number are required'});
    return;
  }
  
  readFile(__dirname + dbPath, (error, data) => {
    if (error) {
      res.status(500).send({error: 'Failed to read game data from DB'});
      return;
    }

    const dbData = JSON.parse(data);
    if(!dbData[gameId]) {
      res.status(404).send({error: `Data not found for game id: ${gameId}`});
      return;
    }

    const timestamp = new Date().getTime();
    const randomNumber = dbData[gameId].randomNumber;
    const remainingGuessTimes = dbData[gameId].remainingGuessTimes > 0? dbData[gameId].remainingGuessTimes - 1 : 0;
    let tempCorrectNumber = randomNumber;
    let tempGuessNumber = userGuess;
    let resultCorrectA = 0; //numbers of correct number and correct location
    let resultCorrectB = 0; //numbers of correct number and wrong location
    let result = 'Incorrect';
    let status = GAME_STATUS.ongoing; // Default status

    /* 
     * Start to scan and compare the digit numbers between two numbers. (Answer number and Guessed number)
     * The loop checks the number's correction and location.
     * Example:
     * Answer number:   1234
     * Guessed number:  3514  
     * 
     * After the loop's checking, the system will get the result below:
     *  ==> resultCorrectA = 1 (1 correct number with correct location)
     *  ==> tempCorrectNumber = '123n'
     *  ==> tempGuessNumber = '351m'
     * 
     * Then the next loop only checks the number's correction. 
     * (The correct numbers with correct locations are already be replaced by 'n' and 'm' characters)
     * 
     * After the second loop's checking, the system will get the result below:
     *  ==> resultCorrectB = 2
     *  ==> tempCorrectNumber = 'k5km'
     * 
     *  1 'm' character means 1 correct number with correct location.
     *  2 'k' characters means 2 correct number (with wrong location).
     * 
     *  Result will be 1 correct number with correct location and 2 correct numbers.  
     * 
     * */     
    for(let icounter = 0; icounter < digitNum; icounter++)
    {
      //Check correct number and location first
      if(randomNumber[icounter] == userGuess[icounter])
      {
        resultCorrectA++;
        //Replace the character on the specififed location with a dummy character.
        tempCorrectNumber = tempCorrectNumber.substring(0,icounter) + 'n' + tempCorrectNumber.substring(icounter+1);
        tempGuessNumber = tempGuessNumber.substring(0,icounter) + 'm' + tempGuessNumber.substring(icounter+1);        
      }
    }

    for(let icounter = 0; icounter < digitNum; icounter++)
    {
      //Check correct number 
      if(tempCorrectNumber.includes(tempGuessNumber[icounter]))
      {
        //Replace the correct character with the wrong location. (i.e. "123k" )
        tempCorrectNumber = tempCorrectNumber.replace(tempGuessNumber[icounter],'k');
        resultCorrectB++;        
      }
    }

    if(resultCorrectA === 0 && resultCorrectB === 0)
    {
      result = 'Incorrect!';
    }
    else if(resultCorrectB === 0)
    {      
      if(resultCorrectA === 4)
      {
        result='Correct!';
      }
      else
      {
        result = `${resultCorrectA} correct number(s) with the correct location(s).`;
      }
      
    }
    else if(resultCorrectA === 0)
    {
      result = `${resultCorrectB} correct number(s).`;
    }
    else
    {
      result = `${resultCorrectA} correct number(s) with the correct location(s) and ${resultCorrectB} correct number(s).`;
    }
    
    // Update game status
    if(resultCorrectA === 4)
    {
      status = GAME_STATUS.won;
    }
    else if(status === GAME_STATUS.ongoing && remainingGuessTimes === 0)
    {
      status = GAME_STATUS.lost;
    }    

    // Update game data 
    dbData[gameId].guessContent.push({guess: userGuess, result: result, updated: timestamp});
    dbData[gameId].remainingGuessTimes = remainingGuessTimes;
    dbData[gameId].status = status;

    // Write the game data into db.json
    writeFile(__dirname + dbPath, JSON.stringify(dbData), (err) => {
      if (err) {
        res.status(500).send({error: 'Failed to write game data to DB'});
        return;
      }

      res.status(200).send({data: {
        id: gameId,
        level: dbData[gameId].level,
        guessContent: dbData[gameId].guessContent,
        remainingGuessTimes: remainingGuessTimes,
        status: status,
        remainingHintTimes : dbData[gameId].remainingHintTimes,
        // don't relase randomNumber to clinet until the game is over in case user check the API response from Developer Tool!
        randomNumber: status !== GAME_STATUS.ongoing? randomNumber : 'secret'
      }});
    });
  });
});

/**
 * Handles incoming requests to return a hint number to client
 * URL: GET /api/game/:id/hint
 * Response: A json format data with game detailed info
 *
 * Example JSON response:
 * {"data":{"id":"game_50","hintContent":[{"hintNumber":"6","updated":1651037192368}],"remainingHintTimes":3}}
 */
app.get("/api/game/:id/hint", (req, res) => {
  const gameId = req.params.id;
  
  if(!(gameId)) {
    res.status(400).send({error: 'Game id is required'});
    return;
  }

  readFile(__dirname + dbPath, (error, data) => {
    if (error) {
      res.status(500).send({error: 'Failed to read game data from DB'});
      return;
    }

    const dbData = JSON.parse(data);
    if(!dbData[gameId]) {
      res.status(404).send({error: `Data not found for game id: ${gameId}`});
      return;
    }

    const timestamp = new Date().getTime();
    let remainingHintTimes = dbData[gameId].remainingHintTimes;
    let hintCacheNumber = dbData[gameId].hintCacheNumber;
    let hintNumberLocation; // 0 - (digitnum -1)
    let numberOfNChar = (hintCacheNumber.match(/n/g)||[]).length; 
    let hintNumber;

    if(remainingHintTimes === 0 || numberOfNChar === digitNum) {      
      res.status(200).send({data: {
        id: gameId,
        hintContent: dbData[gameId].hintContent,
        remainingHintTimes: dbData[gameId].remainingHintTimes
      }});
      return;
    } 
    remainingHintTimes = remainingHintTimes -1;

    do{
        hintNumberLocation = Math.floor(Math.random() * digitNum );      
    }
    while (hintCacheNumber[hintNumberLocation] === 'n');
    
    hintNumber = hintCacheNumber[hintNumberLocation]    
    //replace the number with 'n'.
    hintCacheNumber=hintCacheNumber.substring(0,hintNumberLocation)+'n'+hintCacheNumber.substring(hintNumberLocation+1);
    
    // For debugging
    // console.log('hintNumberLocation:',hintNumberLocation);
    // console.log('Hint Number:',hintCacheNumber[hintNumberLocation]);
    // console.log('hintCacheNumber:',hintCacheNumber);
    // console.log('remainingHintTimes',remainingHintTimes);
    // console.log('======================');

    // Update game data in db.json
    dbData[gameId].hintContent.push({hintNumber: hintNumber, updated: timestamp});
    dbData[gameId].remainingHintTimes = remainingHintTimes;
    dbData[gameId].hintCacheNumber = hintCacheNumber;
    writeFile(__dirname + dbPath, JSON.stringify(dbData), (err) => {
      if (err) {
        res.status(500).send({error: 'Failed to write game data to DB'});
        return;
      }
  });

  res.status(200).send({data: {
    id: gameId,
    hintContent: dbData[gameId].hintContent,
    remainingHintTimes: dbData[gameId].remainingHintTimes
  }});
  });
});

// By default, the server will be running on 3001
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
