import React from 'react';
import styles from './home.component.css';
import { 
  NavLink 
  } from 'react-router-dom';

export default class CakeListComponent extends React.Component {
  render() {
  
    return (
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <NavLink className={styles.link}to="/cakes" activeClassName="active">
            Click here to see some delicious cakes! 
          </NavLink>
        </div>
      </div>
    ); 
  }
}

