import 'idempotent-babel-polyfill';

import $SDK from 'jquery';
import { v4 as uuid } from 'uuid';

import tracking from './libs/tracking';
import url from './libs/url';
import components from './components/index';

window.$SDK = $SDK;

// slick.init();

const currentSession = window.sessionStorage.getItem('sdk-session-id');
if (!currentSession) {
  window.sessionStorage.setItem('sdk-session-id', uuid());
}

// Setting the sessionStorage
const currentSource = window.sessionStorage.getItem('sdk-utm-source');

if (!currentSource || currentSource === 'null' ) {
  window.sessionStorage.setItem('sdk-utm-source', url.param('utm_source'));
  window.sessionStorage.setItem('sdk-utm-campaign', url.param('utm_campaign'));
  window.sessionStorage.setItem('sdk-utm-medium', url.param('utm_medium'));
  window.sessionStorage.setItem('sdk-utm-term', url.param('utm_term'));
  window.sessionStorage.setItem('sdk-utm-content', url.param('utm_content'));
}

// See package.json -> version
const version = process.env.VERSION;

// Public components
window.SDK = {

  version,

  render(props) {
    components.render.init(props);
  }

};

// Load compoments via public function
if (typeof window.onSDKLoad === 'function') {
  window.onSDKLoad();
}

tracking( { category: 'page', event: 'load', value: 'page' } );
