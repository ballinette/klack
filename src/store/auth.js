import {router} from '../main';
import kuzzle from '../services/kuzzle';
import userStore from './user';

export default {
  state: {
    errorLogin: null
  },
  login (username, password) {
    kuzzle.login('local', {username, password}, '1h', (error, response) => {
      this.state.errorLogin = null;
      if (error) {
        if (error.message) {
          this.state.errorLogin = error.message
        }

        return false;
      }

      window.sessionStorage.setItem('jwt', response.jwt);

      userStore.getCurrentUser(() => {
        router.go({name: 'home'});
      });
    });
  },
  logout () {
    kuzzle.logout();
    userStore.removeCurrentUser();
    window.sessionStorage.removeItem('jwt');
  }
}