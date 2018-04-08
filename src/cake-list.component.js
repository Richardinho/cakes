import React from 'react';
import Rx from 'rxjs/Rx';
import { TransitionGroup, CSSTransition, Transition} from '../react-transition-group/src';
import styles from './cake-list.component.css';


export default class CakeListComponent extends React.Component {

  constructor(props) {
    super(props);  
    this.state = {
      cakes: [
      ],
      loaded: false
    }; 
    this.addCake = this.addCake.bind(this);
  }

  componentDidMount() {
    this.subscription = Rx.Observable
      .fromPromise(this.props.cakesService.getCakeList())
      .subscribe(cakes => {
        this.setState({
          cakes,
          loaded: true
        });
      }); 
  }

  componentWillUnmount () {
    this.subscription.unsubscribe();
  }

  addCake() {
    this.props.history.push('/add-your-own-cake');      
  }

  render () {

    const renderCake = (cake, index) => {
      return (
        <CSSTransition timeout={400} key={cake.id} classNames="listitem">
          <div className={styles.card} >
            <div>Cakes: {cake.name}</div> 
            <div className={styles.imageContainer}>
              <img className={styles.image} src={cake.imageUrl}/>
            </div>
            <div>{cake.comment}</div>
            <div>{cake.yumFactor}</div>
          </div>
        </CSSTransition>
      ); 
    }
    const showLoadingMessage = () => {
      return (
        <div className={styles.loadingMessage}>
          <h2>Please wait as we prepare your delicious cakes!</h2>
        </div>
      );
    };

    return (
      <div className={styles.container}>
        <button onClick={this.addCake}>Add your own favourite cake</button>
        <div className={styles.listContainer}>
          {!this.state.loaded && showLoadingMessage()}
          <TransitionGroup component="div" className={styles.items}>
            {this.state.cakes.map(renderCake)}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

