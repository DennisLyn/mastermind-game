import { Space,  Typography} from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Rule = () => (
  <Space size="large" direction="vertical">
    <section>
      <Title>Mastermind Game Rule <QuestionCircleTwoTone /></Title>
      
    </section>
    <section>
      <Title level={2}>Game rules</Title>
      <ul>
        <li>At the start of the game, the application will randomly select a pattern of four different numbers from a total of 8 different numbers (0 - 7).</li>
        <li>You will have <b>10</b> attempts to guess the number combinations</li>
        <li>
          <div>At the end of each guess, the application will provide one of the following response as feedback:</div>
          <ul>
            <li>Incorrect - no correct numbers.</li>
            <li> number of correct numbers with the correct locations, and number of current numbers.</li>
            <li>Correct - you won the game!</li>
          </ul>
        </li>
      </ul>
    </section>
    <section>
      <Title level={2}>Example Run:</Title>
      <p>Game initializes and selects: <b>4227</b></p>
      <div>Guess 1 - You entere: <b>0000</b>, game responds: <b>Incorrect</b>.</div>
      <div>Guess 2 - You entered: <b>1234</b>, game responds:  <b> 1 correct number(s) with the correct location(s) and 1 correct number(s)</b>.</div>
      <div>Guess 3 - You entered: <b>2234</b>, game responds:  <b> 1 correct number(s) with the correct location(s) and 2 correct number(s)</b>.</div>
      <div>Guess 4 - You entered: <b>7242</b>, game responds:  <b> 1 correct number(s) with the correct location(s) and 3 correct number(s)</b>.</div>
      <div>Guess 5 - You entered: <b>4272</b>, game responds:  <b> 2 correct number(s) with the correct location(s) and 2 correct number(s)</b>.</div>
      <div>Guess 6 - You entered: <b>4252</b>, game responds:  <b> 2 correct number(s) with the correct location(s) and 1 correct number(s)</b>.</div>
      <div>Guess 7 - You entered: <b>4257</b>, game responds:  <b> 3 correct number(s) with the correct location(s) and 1 correct number(s)</b>.</div>
      <div>Guess 8 - You entered: <b>4257</b>, game responds:  <b> 3 correct number(s) with the correct location(s) and 1 correct number(s)</b>.</div>
      <div>Guess 9 - You entered: <b>4277</b>, game responds:  <b> 3 correct number(s) with the correct location(s) and 0 correct number(s)</b>.</div>
      <div>Guess 10 - You entered: <b>4227</b>, game responds:  <b>Correct</b>.</div>
    </section>
    <section>
      <Title level={2}>Game Level:</Title>
      <ul>
        <li><b>Easy Level</b>: The numbers are between <b>0-7</b> and the game allows <b>4</b> hints.</li>
        <li><b>Medium Level</b>: The numbers are between <b>0-8</b> and the game allows <b>3</b> hints.</li>
        <li><b>Hard Level</b>: The numbers are between <b>0-9</b> and the game allows <b>2</b> hints.</li>
      </ul>     
    </section>
  </Space>
);

export default Rule;