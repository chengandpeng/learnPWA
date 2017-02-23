import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import swURL from './sw';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swURL).then(reg => {
        if (!navigator.serviceWorker.controller) return;

        if (reg.waiting) {
          this.updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          this.trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener('updatefound', () => {
          this.trackInstalling(reg.installing);
        });
      }).catch(error => {
        console.log('service worker register fail');
      })
    }
  }

  trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        this.updateReady(worker);
      }
    })
  }

  updateReady = () => {
    console.log('update!');
    this.setState({ isUpdate: true });
  }

  renderUpdate = () => {
    const { isUpdate } = this.state;
    if (!isUpdate) return;
    return <p className='banner'>New Update</p> 
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To1 get started, edit <code>src/App.js</code> and save to reload.
        </p>
        { this.renderUpdate() }
      </div>
    );
  }
}

export default App;
