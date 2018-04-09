import React from 'react';
import { TransitionGroup, CSSTransition, Transition} from 'react-transition-group';
import { Route } from 'react-router-dom';

import styles from './transition-route.css';

const firstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};


export default class TransitionRoute extends React.Component {

  render () {
    const PageComponent = this.props.component; 
    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        children={( props ) =>(
          <TransitionGroup 
          className={styles.container} 
          component={firstChild}>
          {
            props.match &&
              <CSSTransition
                classNames="page"
                timeout={400}
              >
               <PageComponent {...this.props} {...props}/> 
              </CSSTransition>
          } 
          </TransitionGroup>
        )}
      />

    )
  }
}
