/* global Dialogflow */

module.exports = {
  fullfilment(req, res) {
    res.jsonp(Dialogflow.parse(req.body));
  },

  demo(req, res) {
    res.render('chatbot.njk');
  }
};
