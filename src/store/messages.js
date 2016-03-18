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
   * TODO - Step 9: Fetch channel messages from Kuzzle persistent data
   * TODO - Step 10: Fetch only the 30 last messages
   */
  loadMessages (channel) {
    this.state.messages = [];
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
   * TODO - Step 11: Use Kuzzle advancedSearch to search terms in the given channel
   */
  search (channel, searchTerms) {
    this.state.searchMessages = [
      {
        content: "Message content",
        user: {
          profileId: -1,
          pictureId: 3,
          username: "Bob"
        },
        channel: channel
      }
    ]
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
