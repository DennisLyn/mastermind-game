import { RocketOutlined, QuestionCircleOutlined, DribbbleSquareOutlined} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React from "react";

import Home from "./views/Home";
import Rule from "./views/Rule";
import NotFound from "./views/NotFound";
import AboutPage from './views/AboutPage';

// Use Ant design as site default style
import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <BrowserRouter>
      <Layout className="layout">
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[window.location.pathname]}>
            <Menu.Item key={'/'} icon={<RocketOutlined size="large"/>}><Link to="/">Mastermind Game</Link></Menu.Item>
            <Menu.Item key={'/rule'} icon={<QuestionCircleOutlined />}><Link to="/rule">How to Play?</Link></Menu.Item>
            <Menu.Item key={'/aboutpage'} icon={<DribbbleSquareOutlined />}><Link to="/aboutpage">About</Link></Menu.Item>
          </Menu>
       </Header>
       <Content style={{ padding: '50px', margin: 'auto'}}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/rule" element={<Rule />} />
          <Route exact path="/aboutpage" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by Pankun Lin</Footer>
    </Layout>
    </BrowserRouter>
  );
}

export default App;
