import React, {Component} from 'react';
import styles from './yum-rating.component.css';

const Heart = (item, index) => (<div key={index} className={styles.heartContainer}><div className={styles.heart}></div></div>);

export default ({rating, fontSize}) => {
  let array = [];
  for(let i=0; i < rating; i++) {
    array[i] = true;
  }
  return (
    <div style={{fontSize: fontSize}} className={styles.container}>
      <span className={styles.rating}>Yum Rating:</span>
      {array.map(Heart)} 
    </div>
  )
};
  


