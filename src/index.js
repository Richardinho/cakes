import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css';
import { AppContainer } from 'react-hot-loader'
import App from './app.component'
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

if ('serviceWorker' in navigator) {
  const registration = runtime.register();
}

render(App)

