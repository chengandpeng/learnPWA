import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import swURL from './sw';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(swURL).then(register => {
		// console.log(register);
	});
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
