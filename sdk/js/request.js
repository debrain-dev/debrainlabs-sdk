import axios from 'axios';
import { shim } from 'promise.prototype.finally';

// Enable finally promisse into axios ...finally( () => { })
shim();

// Add the base url to axios
let domainBase = 'https://jagermeisterhotline.debrain.cloud/api';

const currentDomain = window.location.href;

if ( currentDomain.indexOf( 'localhost' ) !== -1 ) {
  // Local Environment
  domainBase = `${window.location.protocol}//${window.location.host}/api`;
} else if ( currentDomain.indexOf( '192.168' ) !== -1 ) {
  // Local Environment
  domainBase = `${window.location.protocol}//${window.location.host}/api`;
} else if ( currentDomain.indexOf( 'herokuapp' ) !== -1 ) {
  // Staging Environment
  domainBase = 'https://debrain-jagermeister-chatbot.herokuapp.com/api';
} else if ( currentDomain.indexOf( 'hellodebrain.com' ) !== -1 ) {
  // Debrain Environment
  domainBase = 'https://jagermeister-bot.hellodebrain.com/api';
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
