import React from 'react';
import styles from './add-cake.component.css';

let currentId = 0;

function createId() {
  return currentId++;
}

const images = [
  'cake-1.jpg',
  'cake-2.jpg',
  'cake-3.jpg',
  'cake-4.jpg',
  'cake-5.jpg'
];

export default class AddCakeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      comment: '',
      yumFactor: '3' ,
      imageUrl: ''
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleCommentChange(event) {
    this.setState({
      comment: event.target.value
    });
  }

  handleOptionChange(event) {
    this.setState({
      yumFactor: event.target.value 
    });
  }

  handleImageClick(imageUrl) {
    this.setState({
      imageUrl
    });
  }

  onSubmit() {
    let data = Object.assign({}, this.state);
    data.id = createId();
    this.props.cakesService.addCake(data); 
    this.props.history.push('/cakes-list');      
  }

  cancel () {
    this.props.history.push('/cakes-list'); 
  }

  render() {

    const renderImage = (image, index) => {
      const path = 'http://richardhunter.co.uk/cake-images';

      return (
        <div className={styles.imageContainer} key={index}>
          <img onClick={this.handleImageClick.bind(this, `${path}/${image}`)} src={`${path}/${image}`}/> 
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <label className={styles.label}>name:<input className={styles.input} onChange={this.handleNameChange} value={this.state.name}/></label> 
        <label className={styles.label}>comment:<textarea onChange={this.handleCommentChange} value={this.state.comment}/></label>

        <div>Yum factor:</div>

        <div className={styles.yumFactorContainer}>
          <label>
            <input onChange={this.handleOptionChange} type="radio" value="1" checked={this.state.yumFactor === '1'} />
            1
          </label>

          <label>
            <input onChange={this.handleOptionChange} type="radio" value="2" checked={this.state.yumFactor === '2'} />
            2
          </label>

          <label>
            <input onChange={this.handleOptionChange} type="radio" value="3" checked={this.state.yumFactor === '3'} />
            3
          </label>

          <label>
            <input onChange={this.handleOptionChange} type="radio" value="4" checked={this.state.yumFactor === '4'} />
            4
          </label>

          <label>
            <input onChange={this.handleOptionChange} type="radio" value="5" checked={this.state.yumFactor === '5'} />
            5
          </label>
        </div>

        <div className={styles.images}>
          <h2>Choose an Image</h2>

          {images.map(renderImage)}

          <div className={styles.chosenImage}>
            { this.state.imageUrl && <img src={this.state.imageUrl}/> }
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={this.onSubmit}>Submit (and see your cake in the list of cakes)</button>
          <button onClick={this.cancel}>Cancel (and go back to list of cakes)</button>
        </div>
      </div>
    ); 
  }
}

