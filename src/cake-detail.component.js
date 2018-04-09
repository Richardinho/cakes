import React, {Component} from 'react';
import Rx from 'rxjs/Rx';
import styles from './cake-detail.component.css';
import YumRating from './yum-rating.component';

export default class CakeDetailComponent extends Component {

  constructor(props) {
    super(props);  
    this.state = {
      cake: {}, 
      loaded: false
    }; 
  }

  componentDidMount() {
    
    const id = this.props.match.params.id;

    this.subscription = Rx.Observable
      .fromPromise(this.props.cakesService.getCakeDetail(id))
      .subscribe(cake => {
        this.setState({
          cake,
          loaded: true
        });
      }); 
  }

  componentWillUnmount () {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <div className={styles.container}>
        <h2 className={styles.header}>{this.state.cake.name}</h2> 
        <img className={styles.image} src={this.state.cake.imageUrl}/>
        <div className={styles.comment}>{this.state.cake.comment}</div>
        <YumRating fontSize="18px" rating={this.state.cake.yumFactor}/>
      </div> 
    );
  }

}
