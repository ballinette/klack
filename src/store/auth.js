import {router} from '../main';
import kuzzle from '../services/kuzzle';
import userStore from './user';

export default {
  state: {
    errorLogin: null
  },
  login (username, password) {
    /** TODO - Step 12: Log in the user to Kuzzle */
    this.state.errorLogin = null;

    /** Once kuzzle response is received, following code should be called:
     window.sessionStorage.setItem('jwt', <something>);

     userStore.getCurrentUser(() => {
        router.go({name: 'home'});
      });
     */
  },
  logout () {
    /** TODO - Step 12: Log out the user to Kuzzle */

    userStore.removeCurrentUser();
    window.sessionStorage.removeItem('jwt');
  }
}