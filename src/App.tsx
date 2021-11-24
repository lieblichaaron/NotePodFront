import React from 'react';
import Login from './veiws/Login';
import SearchPage from './veiws/SearchPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/styles/universalStyles.css';

const code = new URLSearchParams(window.location.search).get('code');

const App = function () {
  return code ? <SearchPage code={code} /> : <Login />;
};

export default App;
