import kuzzle from '../services/kuzzle'

export default {
  state: {
    channels: [],
    searchTerms: '',
    current: null
  },
  /**
   * Get channels from Kuzzle
   */
  getChannels () {
    var query = {
      sort: ['name'],
      from: 0,
      size: 9999
    };

    kuzzle
      .dataCollectionFactory('channels')
      .advancedSearch(query, (error, result) => {
        if (error) {
          console.error(error);
          return false;
        }

        this.state.channels = result.documents.map(channel => channel.content.name);
      });
  },
  /**
   * Allow to add a new channel given in parameter
   * @param channel
   * @returns {Number}
   */
  addChannel (channel) {
    kuzzle
      .dataCollectionFactory('channels')
      .createDocument({name: channel});
  },
  /**
   * Remove a channel according to the channel name given
   * @param channel
   */
  removeChannel (channel) {
    return this.state.channels.$remove(channel)
  },
  /**
   * Set the current channel
   * @param {String} channel
   */
  setCurrent (channel) {
    this.state.current = channel;
    this.state.searchTerms = '';
  },
  /**
   * Subscribe to channels
   * @param {String} channel
   */
  subscribeChannels () {
    var options = {
      scope: 'in',
      subscribeToSelf: true,
      state: 'done'
    };

    kuzzle
      .dataCollectionFactory('channels')
      .subscribe({}, options, (error, response) => {
        if (error) {
          console.error(error);
          return false;
        }

        this.state.channels.push(response.result._source.name);
        this.state.channels.sort();
      });
  }
}