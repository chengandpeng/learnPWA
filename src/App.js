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


  // handleUpdate = () => {
  //   if (this.worker)
  //     this.worker.postMessage({ action: 'skipWaiting' });
  // }

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
