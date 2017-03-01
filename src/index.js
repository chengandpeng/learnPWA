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

ReactDOM.render(
  <App fb={fb}/>,
  document.getElementById('root')
);