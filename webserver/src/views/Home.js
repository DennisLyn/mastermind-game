import { Button, Input, Form, Space, Table, Select, Alert, Typography, Result } from 'antd';
import { SmileOutlined, FrownOutlined, RocketTwoTone } from '@ant-design/icons';
import React from "react";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Title } = Typography;

/**
 * @summary
 * 1. There are 3 different UIs on this page
 *  Game start - initial page. Allow the user to create a new game and select the game level
 *  Game ongoing - a gmae is ongoing. Show all guessing results and allow the user to enter 4 numbers
 *  Game over - a game is finished. Show all guessing results, finial messages, and allow the user to create a new game
 * 2. Alert message will be showing when there is a error occurred
 * 3. For the game form, it will become valid when the input of guess number contains 4 numbers (0-7)
 */
const Home = () => {
  const [currentGameLevel, setCurrentGameLevel] = useState('easy');
  const [currentGameInfo, setCurrentGameInfo] = useState(null);
  const [currentGameData, setCurrentGameData] = useState(null);
  const [currentHintData, setCurrentHintData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [form] = Form.useForm();
  const [currentUsreName, setCurrentUser]=useState(localStorage.getItem('userName'));
  const isGameOver = currentGameData && currentGameData.status && (currentGameData.status==='won' || currentGameData.status==='lost');

  // Update 'currentGameLevel' when game level is changed by select drop down
  const onGameLevelChange = (value) => {
    setCurrentGameLevel(value);
  }  

  // Create a new game and update 'currentGameInfo' or 'errorMessage'
  const onStartGame = async () => {
    
    setErrorMessage(null);
   
    const response = await fetch(`/api/game`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        level: currentGameLevel,
      }),
    });
    try {
      const { data } = await response.json();
      let userName = form.getFieldValue('userName');      

      setCurrentGameInfo(data);
 
      if(userName)
      {
        localStorage.setItem('userName',form.getFieldValue('userName'));
      }      
      
      // let userId = localStorage.getItem('userId');
      // if(!userId)
      // {
      //   const timestamp = new Date().getTime();
      //   userId = 'usr' + timestamp.toString();
      //   localStorage.setItem('userId', userId);
      // }
 
    } catch {
      setErrorMessage('An error occurred when starting a game');
    }
  };

  // Submit a user's guessing and update 'currentGameData' or 'errorMessage'
  const onFormSubmit = async () => {
    setErrorMessage(null);
    const { userGuess } = await form.validateFields();
    const response = await fetch(`/api/game/${currentGameInfo.id}/guess/${userGuess}`, { method: 'POST'});
    try {
      const { data } = await response.json();
      setCurrentGameData(data);      
    } catch {
      setErrorMessage('An error occurred when playing a game');
    } finally {
      form.setFieldsValue({
        userGuess: '',
      });
    }
  };
  
  // Request a hint from server
  const onHintFormSubmit = async () => {
    setErrorMessage(null);    
    const response = await fetch(`/api/game/${currentGameInfo.id}/hint`, { method: 'GET'});
    try {
      const { data } = await response.json();
      setCurrentHintData(data);
    } catch {
      setErrorMessage('An error occurred when playing a game');
    }
  };

  // Generate and return a UI temptlate when the game is over (won or lost)
  const gameFinalResult = () => {
    if(!isGameOver) {
      return null;
    }

    const isWin = currentGameData?.status === 'won' ? true : false;
    return (
      <Result
        icon={isWin? <SmileOutlined /> : <FrownOutlined />}
        title={isWin? 'Congratulations! You won!' : 'Game Over!'}
        subTitle={`Correct answer is: ${currentGameData.randomNumber}`}
        extra={[
          <Button type="primary" onClick={resetAllState}>
            <Link to="/">Play Again</Link>
          </Button>
        ]}
      />
    );
  };

  // Show hint history
  const ListHintContent = () =>{
    let returnString = "";
    if(currentHintData?.hintContent){
      for (let icounter = 0; icounter < currentHintData.hintContent.length; icounter++){
        returnString=<><div>{returnString}</div><div>{`The answer includes the number: ${currentHintData.hintContent[icounter].hintNumber} `}</div></>;
      }
    }    
    return returnString;
  } 

  // Reset all state values when restarting a new game
  const resetAllState = () => {
    setCurrentGameLevel('easy');
    setCurrentGameInfo(null);
    setCurrentGameData(null);
    setErrorMessage(null);
    setCurrentUser(localStorage.getItem('userName'));
    setCurrentHintData(null);
  };

  return (
    <div>
      <Title>Play Mastermind Game Online <RocketTwoTone/></Title>
      {/** Error message will be shown when there is an error occurred */}
      { errorMessage &&
        <Alert
          message={errorMessage}
          banner
          type="error"
        />
      }
      {
        !currentGameInfo? (
          <>
            {/** Game start UI */}
            <p>Are you ready? Select a level and press the button to start a game now! Have fun and good luck!</p>
            {
              currentUsreName?(
                <>
                  Welcome back! {currentUsreName} <br/>Not {currentUsreName}? click 
                  <Button type='link' onClick={()=>{
                    localStorage.clear();
                    setCurrentUser(null);
                  }}>HERE</Button> 
                </>
              ):(
                <>
                  <p>Please enter your name (optional): </p>
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name={"userName"}            
                    >
                      <Input                  
                        style={{width:300, backgroundColor:'white'}}
                        placeholder='Your name'        
                      />
                    </Form.Item>
                  </Form>
                </>
              )
            }            
            <Space direction="horizontal" size="large">                
              <Select defaultValue="easy" style={{ width: 200 }} onChange={onGameLevelChange}>
                <Select.Option value="easy">Easy</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="hard">Hard</Select.Option>
              </Select> 
              <Button shape="round" size="large" type="primary" onClick={onStartGame}>Start</Button>
            </Space>           
          </>
          ):(
          <Space direction="vertical">
            {/** Game ongoing UI */}
            <Form form={form} layout="vertical">
              <Form.Item
                name={"userGuess"}
                label={`Enter a 4-digit combination using ${currentGameInfo.gameSetting.minNum} - ${currentGameInfo.gameSetting.maxNum} ( (Duplicate numbers are allowed)`}
                rules={[
                  {
                    required: true,
                    pattern: new RegExp(`([${currentGameInfo.gameSetting.minNum}-${currentGameInfo.gameSetting.maxNum}]{4})`),
                    message: `Please enter 4 numbers (${currentGameInfo.gameSetting.minNum} - ${currentGameInfo.gameSetting.maxNum}) to continue the game`,
                  },
                ]}
              >
                <Input
                  placeholder="(e.g. 1122)"
                  maxLength="4"
                  onPressEnter={onFormSubmit}
                />
              </Form.Item>
              <Button
                key="submit"
                type="primary"
                shape="round"
                onClick={onFormSubmit}
                disabled={isGameOver}
                size="large"
              >
                Submit
              </Button>
            </Form>
            <br/>
            {/** Game over UI - when game is over, the template of gameFinalResult will be shown */}
            {gameFinalResult()}
            {
              currentGameData && currentGameData.guessContent.length &&
              <Space direction="vertical" size="large" style={{display: 'flex'}}>
                <Title level={4}>History of your guesses</Title>
                <div><b>Game level:</b> {currentGameData.level}, <b>Remaining times:</b> {currentGameData.remainingGuessTimes}, <b>Total tried times:</b> {currentGameData.guessContent.length}</div>                
                <div>Do you need hint? (You can have <b>{currentHintData?.remainingHintTimes || currentHintData?.remainingHintTimes ===0 ?currentHintData.remainingHintTimes:currentGameData.remainingHintTimes}</b> times of hints.)
                &nbsp;               
                <Button 
                  key="submit"
                  type="default"
                  shape="round" 
                  size="large"
                  disabled={currentHintData?.remainingHintTimes===0}
                  onClick={onHintFormSubmit}>
                  Provide hint</Button>               
                {ListHintContent()}
                </div>
                <Table
                  dataSource={currentGameData.guessContent}
                  rowKey="id"
                  columns={[
                    {
                      title: 'Your guess',
                      dataIndex: 'guess',
                      sorter: (a, b) => (a - b),
                    },
                    {
                      title: 'Result',
                      dataIndex: 'result',
                      sorter: (a, b) => (a - b),
                    },
                    {
                      title: 'Submited time',
                      dataIndex: 'updated',
                      defaultSortOrder: 'descend',
                      sorter: (a, b) => (a.updated || 0) - (b.updated || 0),
                      render: (updated) => (
                        <span>
                          {dayjs(updated).format('MM/DD/YYYY h:mm:ss A')}
                        </span>
                      )
                    },
                  ]}
                  pagination={false}
              />
            </Space>
            }
          </Space>
        )
      }
    </div>
  );
};

export default Home;
