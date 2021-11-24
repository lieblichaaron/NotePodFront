import React from 'react';
import Login from './veiws/Login';
import Dashboard from './veiws/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/styles/universalStyles.css';

const code = new URLSearchParams(window.location.search).get('code');

const App = function () {
  return code ? <Dashboard code={code} /> : <Login />;
};

export default App;
