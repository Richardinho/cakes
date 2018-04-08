import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css';
import { AppContainer } from 'react-hot-loader'
import App from './app.component'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./app.component', () => { 
    render(App) 
  })
}
