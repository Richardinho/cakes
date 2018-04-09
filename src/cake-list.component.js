import React from 'react';
import Rx from 'rxjs/Rx';
import { TransitionGroup, CSSTransition, Transition} from 'react-transition-group';
import styles from './cake-list.component.css';
import YumRating from './yum-rating.component';

const goodData = (cake) => {
  return cake.name && cake.comment && cake.imageUrl;
};

export default class CakeListComponent extends React.Component {

  constructor(props) {
    super(props);  
    this.state = {
      cakes: [
      ],
      loaded: false
    }; 
    this.addCake = this.addCake.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  componentDidMount() {
    this.subscription = Rx.Observable
      .fromPromise(this.props.cakesService.getCakeList())
      .subscribe(cakes => {
        this.setState({
          cakes: cakes.filter(goodData),
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

  handleImageClick(event) {
    const href = event.currentTarget.getAttribute('href');
    event.preventDefault();
    this.props.history.push(href)
  }

  render () {

    const renderCake = (cake, index) => {
      return (
        <CSSTransition timeout={400} key={cake.id} classNames="listitem">
          <div className={styles.card} >
            <div className={styles.name}>{cake.name}</div> 
            <div className={styles.imageContainer}>
            <a onClick={this.handleImageClick} href={`/cakes/${cake.id}`}>
              <img className={styles.image} src={cake.imageUrl}/>
            </a>
            </div>
            <div className={styles.comment}>{cake.comment}</div>
            <YumRating fontSize="12px" rating={cake.yumFactor}/>
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
        <div className={styles.header}>
          <button onClick={this.addCake}>Add your own favourite cake</button>
        </div>
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

