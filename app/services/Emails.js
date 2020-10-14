const PR = require('request-promise');

module.exports = {

  send(payload) {

    const options = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      uri: 'https://your-domain.debrain.cloud/api/contacts/add', // @TODO: change for your proyect
      body: payload,
      json: true // Automatically stringifies the body to JSON
    };

    // console.log(payload);

    return PR(options)
      .then( (result) => {
        console.log(result);
      })
      .catch( (error) => {
        console.log(error);
      });

  }

};
