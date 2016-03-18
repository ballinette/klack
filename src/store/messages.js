import kuzzle from '../services/kuzzle'

let subscription = null;

export default {
  state: {
    messages: [],
    searchMessages: []
  },

  /**
   * Send the message to Kuzzle and to other users
   * @param {String} content
   * @param {Object} user
   * @param {String} channel
   */
  sendMessage (content, user, channel) {
    var message = {content, user, channel, date: Date.now()};

    kuzzle
      .dataCollectionFactory('messages')
      .createDocument(message);
  },

  /**
   * Reset the current message list
   */
  resetMessages () {
    this.state.messages = [];
    this.state.searchMessages = [];
  },
  /**
   * Load messages from Kuzzle according to the channel
   * @param {String} channel
   */
  loadMessages (channel) {
    var query = {
      sort: {date: 'desc'},
      from: 0,
      size: 30,
      filter: {
        term: {
          channel: channel
        }
      }
    };

    kuzzle
      .dataCollectionFactory('messages')
      .advancedSearch(query, (error, result) => {
        if (error) {
          console.error(error);
          return false;
        }

        this.state.messages = result.documents
          .map(message => {
            return {
              ...message.content,
              id: message.id
            };
          })
          .reverse();
      });
  },
  /**
   * Subscribe to messages according to the channel
   * @param {String} channel
   */
  subscribeMessages (channel) {
    var
      // Define the filter
      filter = {
        term: {
          channel: channel
        }
      },
      options = {
        scope: 'all',
        subscribeToSelf: true,
        state: 'done'
      };

    if (subscription) {
      subscription.unsubscribe();
    }

    subscription = kuzzle
      .dataCollectionFactory('messages')
      .subscribe(filter, options, (error, response) => {
        if (response.scope === 'out') {
          this.state.messages = this.state.messages.filter(message => {
            return message.id !== response.result._id;
          });
        }

        if (response.scope === 'in') {
          this.state.messages.push({
            ...response.result._source,
            id: response.result._id
          });
        }
      });
  },
  /**
   * Search for messages from Kuzzle
   * @param {String} channel
   * @param {String} searchTerms
   */
  search (channel, searchTerms) {
    var filter = {
      sort: {date: 'desc'},
      query : {
        match: {
          content: {
            query: searchTerms,
            operator : 'and'
          }
        }
      },
      filter: {
        term: {
          channel
        }
      }
    };

    kuzzle
      .dataCollectionFactory('messages')
      .advancedSearch(filter, (error, result) => {
        if (error) {
          console.error(error);
          return false;
        }

        this.state.searchMessages = result.documents
          .map(message => {
            return {
              ...message.content,
              id: message.id
            };
          });
      });
  },
  resetSearch () {
    this.state.searchMessages = [];
  },
  /**
   * Delete a message
   * @param {String} message
   */
  delete (message) {
    if (!message || !message.id) {
      return false;
    }

    kuzzle
      .dataCollectionFactory('messages')
      .deleteDocument(message.id, (error, response) => {
        if (error) {
          console.error(error);
        }
      });
  }
}
