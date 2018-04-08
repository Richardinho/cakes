export default class CakesService {
  
  getCakeList() {
    const href = 'http://ec2-52-209-201-89.eu-west-1.compute.amazonaws.com:5000/api/cakes';
    return fetch(href, { mode: 'cors'})
      .then(response => response.json()) 
  }

  addCake(cake) {
  
    console.log('addCake', cake);
    return fetch('http://ec2-52-209-201-89.eu-west-1.compute.amazonaws.com:5000/api/cakes/' + cake.id, {
        mode: 'cors',
        method: 'PUT',
        body: JSON.stringify(cake)
      })
      .then(response => {
        console.log('response', response); 
      });
  
  }
}
