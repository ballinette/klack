import kuzzle from '../services/kuzzle';
import {router} from '../main';

export default {
  state: {
    id: null,
    username: null,
    pictureId: null
  },

  init () {
    //this.state.pictureId = Math.floor(Math.random() * 12 + 1);
  },
  isAuthenticated () {
    return !!this.state.id;
  },
  getCurrentUser (cb) {
    var jwt = window.sessionStorage.getItem('jwt');

    if (!jwt) {
      cb('No current user.');
      kuzzle.setJwtToken(undefined);
      return false;
    }

    kuzzle.setJwtToken(jwt);

    kuzzle
      .whoAmI((error, result) => {
        if (error) {
          window.sessionStorage.removeItem('jwt');
          kuzzle.setJwtToken(undefined);
          cb(error);
          return false;
        }

        this.state.id = result.id;
        this.state.username = result.content.username;
        // defaults to author
        this.state.pictureId = result.content.pictureId || 3;

        cb(null, result);
      });
  },
  removeCurrentUser () {
    this.state.id = null;
    this.state.username = null;
    this.state.pictureId = null;
  }
}
