import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './App.css';
import TimeLine from '../TimeLine/TimeLine';

import moment from 'moment';

import 'moment/min/locales';

moment.locale(window.navigator.language);

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <nav style={{ position: 'fixed', top: 0, left: 0 }}>
          <ul>
            <li>
              <Link to="/landing">Landing</Link>
            </li>
            <li>
              <Link to="/">Moneyline</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/landing">Welcome!</Route>
          <Route path="/">
            <TimeLine />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
