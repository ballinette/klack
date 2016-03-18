import kuzzle from '../services/kuzzle';
import {router} from '../main';

export default {
  /** TODO - Step 12: Replace default state with a real default state */
  state: {
    id: -1,
    username: "Bob",
    pictureId: Math.floor(Math.random() * 12 + 1)
  },

  init () {
    //this.state.pictureId = Math.floor(Math.random() * 12 + 1);
  },
  isAuthenticated () {
    return !!this.state.id;
  },
  getCurrentUser (cb) {
    var jwt = window.sessionStorage.getItem('jwt');
    /** Use kuzzle method whoAmI to get current user
     * Hint : you should set kuzzle to use the jwt got above
     */
    cb(null, this.state);
  },
  removeCurrentUser () {
    this.state.id = null;
    this.state.username = null;
    this.state.pictureId = null;
  }
}
