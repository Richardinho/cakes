import React, { Component } from 'react';
import { 
  BrowserRouter, 
  Redirect, 
  NavLink, 
  Route } from 'react-router-dom';
import { 
  TransitionGroup, 
  CSSTransition, 
  Transition } from '../react-transition-group/src';
import TransitionRoute from './transition-route';
import './style.css';
import './app.css';
import CakeListComponent from './cake-list.component.js';
import HomeComponent from './home.component.js';
import AddCakeComponent from './add-cake.component.js';
import styles from './app.component.css';
import CakesService from './cakes.service';

const cakesService = new CakesService();

export default class App extends Component {
  constructor () {
    super(); 
    this.state = {

    };
  }

  render () {
    return (
      <div>
        <BrowserRouter>
          <div>
            <div className={styles.container}>
              <div>
                <TransitionRoute 
                  cakesService={cakesService}
                  component={AddCakeComponent}     
                  path="/add-your-own-cake"  />
                <TransitionRoute 
                  component={HomeComponent}     
                  exact
                  path="/"  />
                <TransitionRoute 
                  cakesService={cakesService}
                  component={CakeListComponent}     
                  path="/cakes"  />
              </div>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

