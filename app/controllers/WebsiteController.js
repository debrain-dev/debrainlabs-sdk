module.exports = {

  get(req, res) {
    res.render('homepage.njk');
  },

  installation(req, res) {
    res.render('installation.njk');
  }

};
