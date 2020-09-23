/* global Record */

module.exports = {

  'get :id': (req, res) => {

    const {
      id
    } = req.params;

    res.vsr( Record.getRecord(id) );

  },

  post: (req, res) => {

    const {
      body
    } = req;

    const {
      occasionType,
      occasionTime,
      vibe
    } = body;

    const data = {
      ...body,
      occasionType: occasionType || 'gameday', // fallback
      occasionTime: occasionTime || 'day', // fallback
      vibe: vibe || 'nice', // fallback
      newsletters: true,
      browser: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    res.vsr( Record.create(data) );

  }

};
