import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';

const config = {  
  apiKey: "AIzaSyDkyOeK9AlZKZlJzqsHciG9RuOBf79xbYQ",
  authDomain: "service-worker-test-36d5e.firebaseapp.com",
  databaseURL: "https://service-worker-test-36d5e.firebaseio.com",
  storageBucket: "service-worker-test-36d5e.appspot.com",
  messagingSenderId: "744062639540"
};

const fb = firebase.initializeApp(config).database().ref('items');

const messaging = firebase.messaging();
messaging.requestPermission()
.then(() => {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM.
  // ...
})
.catch(err => {
  console.log('Unable to get permission to notify.', err);
});

ReactDOM.render(
  <App fb={fb}/>,
  document.getElementById('root')
);