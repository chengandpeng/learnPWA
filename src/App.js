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
    this.worker = null;
    this.reg = null;

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

        this.reg = reg;
      }).catch(error => {
        console.log('service worker register fail');
      })
    }
  }

  trackInstalling = (worker) => {
    worker.addEventListener('statechange', () => {
      const { state } = worker;
      if (state === 'installed') {
        this.updateReady(worker);
      } else if (state === 'activated') {
        this.setState({ isUpdate: false });
        window.location.reload();
      }
    })
  }

  updateReady = (worker) => {
    console.log('update find!');
    this.worker = worker;
    this.setState({ isUpdate: true });
  }


  handleUpdate = () => {
    if (this.worker)
      this.worker.postMessage({ action: 'skipWaiting' });
  }

  renderUpdate = (worker) => {
    const { isUpdate } = this.state;
    if (!isUpdate) return;
    return (
      <p className='banner'>
        <span onClick={() => { this.setState({ isUpdate: false })}}>DISABLE</span>
        <span onClick={() => this.handleUpdate(worker)}>UPDATE</span>
      </p> 
    )
  }

  handlePush = () => {
    console.log(this.reg);
    if (this.reg) {
      const title = 'This is a notification';
      const options = {
        body: 'this is message body',
        icon: 'static/media/logo.5d5d9eef.svg',
        tag: 'request',
        actions: [
          { action: 'yes', 'title': 'Yes' },
          { action: 'no', 'title': 'No'}
        ]
      };
      console.log(this.reg);
      this.reg.showNotification(title, options);
    }
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
        <button onClick={this.handlePush}>Show Notification</button>
        { this.renderUpdate() }
      </div>
    );
  }
}

export default App;
