export default class CakesService {
  
  getCakeList() {
    const href = 'http://ec2-52-209-201-89.eu-west-1.compute.amazonaws.com:5000/api/cakes';
    return fetch(href)
      .then(response => response.json()) 
  }
}
