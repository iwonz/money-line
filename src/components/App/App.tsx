import React from 'react';
import './App.css';
import TimeLine from '../TimeLine/TimeLine';

import moment from 'moment';

import 'moment/min/locales';

moment.locale(window.navigator.language);

const App: React.FC = () => {
  return (
    <div className="app">
      <TimeLine />
    </div>
  );
};

export default App;
