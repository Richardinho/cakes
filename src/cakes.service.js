const url = '/api';

export default class CakesService {

  getCakeList() {
    return fetch(url + '/get-all-cakes')
      .then(response => response.json()) 
  }

  getCakeDetail(id) {

    return fetch(url + '/get-cake/' + id, {
      method: 'GET'
    }).then(response => {
      return response.json();
    });
  }

  addCake(cake) {
    console.log('add cake', cake);

    return fetch(url + '/put-cake/' + cake.id, {
      method: 'PUT',
      body: JSON.stringify(cake)
    }).then(response => {
      console.log('response', response); 
    });
  }
}
