import axios from 'axios';
import { shim } from 'promise.prototype.finally';

// Enable finally promisse into axios ...finally( () => { })
shim();

// @TODO: change for your custom url
//
// Add the base url to axios
let domainBase = 'https://your-sdk.debrain.cloud/api';

const currentDomain = window.location.href;

if ( currentDomain.indexOf( 'localhost' ) !== -1 ) {
  // Local Environment
  domainBase = `${window.location.protocol}//${window.location.host}/api`;

} else if ( currentDomain.indexOf( '192.168' ) !== -1 || currentDomain.indexOf( '127.0.0.1' ) !== -1 ) {

  // Local Environment
  domainBase = `${window.location.protocol}//${window.location.host}/api`;

} else if ( currentDomain.indexOf( 'herokuapp' ) !== -1 ) {

  // @TODO: Heroku Environment

} else if ( currentDomain.indexOf( 'staging' ) !== -1 ) {

  // @TODO: Staging Environment

}

axios.defaults.baseURL = domainBase;

const request = {

  save(values) {

    return axios
      .post('/record', values)
      .then( (result) => {
        const {
          data
        } = result.data;
        return data;
      });

  },

  getRecord(id) {

    return axios
      .get(`/record/${id}`)
      .then( (res) => {
        const {
          data
        } = res.data;
        return data || {};
      })
      .catch( () => {
        return {};
      });

  }

};

export default request;
