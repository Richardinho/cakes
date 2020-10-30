import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css';
import App from './app.component'

const render = Component => {
  ReactDOM.render(
    <Component />,
    document.getElementById('app')
  )
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
render(App)

