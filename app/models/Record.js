/* global Record, Emails, VSError */

/**
 * Record.js
 */

module.exports = {

  attributes: {

    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    dob: {
      type: String
    },
    phone: {
      type: String
    },
    zipcode: {
      type: String
    },
    newsletters: {
      type: String
    },
    source: {
      type: String
    },
    medium: {
      type: String
    },
    campaign: {
      type: String
    },
    term: {
      type: String
    },
    content: {
      type: String
    },
    browser: {
      type: String
    },
    sessionId: {
      type: String
    },
    googleClientId: {
      type: String
    },
    ip: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }

  },

  /**
   *
   * @param {type} data
   * @returns {unresolved}
   */
  getRecord(id) {

    // This is to prevent error while run the findOne
    if (!(/^[a-fA-F0-9]{24}$/).test(id)) {
      return VSError.reject('Invalid ID. Record not found', 404);
    }

    return Record
      .findOne({ _id: id })
      .then( (record) => {

        if (!record || (record && !record._id)) {
          return VSError.reject('Record not found', 404);
        }

        return record;

      });

  },

  /**
   * Method to create a new record
   * @param {Object} data
   */
  create(data) {

    const obj = new Record(data);
    return obj.save();

  },

  /**
   * Before save callback
   * @param {Callback} cb
   */
  beforeSave(cb) {

    const data = this;

    if (!data.email) {
      cb('Please, enter your email');
      return;
    }

    if (!data.name) {
      cb('Please, enter your name');
      return;
    }

    // All good!
    cb();

  },

  /**
   *
   * After save callback
   * @param {Object} data
   * @param {Callback} cb
  */
  afterSave(data, cb) {

    cb();

  }

};
