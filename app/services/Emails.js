const PR = require('request-promise');

module.exports = {

  send(payload) {

    const options = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      uri: 'https://jagermeisteroccasions.debrain.cloud/api/contacts/add',
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
