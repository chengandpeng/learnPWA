import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import swURL from './sw';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(swURL).then(register => {
		console.log('service worker register success');
	}).catch(error => {
		console.log('service worker register fail');
	})
}

// window.addEventListener('beforeinstallprompt', function(e) {
//   e.userChoice.then(function(choiceResult) {

//     console.log(choiceResult.outcome);

//     if(choiceResult.outcome === 'dismissed') {
//       console.log('User cancelled home screen install');
//     }
//     else {
//       console.log('User added to home screen');
//     }
//   });
// });

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
