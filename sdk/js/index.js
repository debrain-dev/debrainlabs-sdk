import 'idempotent-babel-polyfill';

import $SDK from 'jquery';
import uuid from 'uuid/v4';

import tracking from './libs/tracking';
import url from './libs/url';
import components from './components/index';

window.$SDK = $SDK;

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

  demo(props) {
    components.demo.init(props);
  }

};

// Load compoments via public function
if (typeof window.onSDKLoad === 'function') {
  window.onSDKLoad();
}

const currentDomain = window.location.href;

if ( currentDomain.indexOf( 'localhost' ) !== -1 ) {
  // Local Environment
  $SDK('head').append(`<link id="sdk-style" rel="stylesheet" href="/css/sdk.css?v=${version}">`);

} else if ( currentDomain.indexOf( '192.168' ) !== -1 || currentDomain.indexOf( '127.0.0.1' ) !== -1 ) {
  // Local Environment
  $SDK('head').append(`<link id="sdk-style" rel="stylesheet" href="/css/sdk.css?v=${version}">`);

} else if ( currentDomain.indexOf( 'herokuapp' ) !== -1 ) {
  // Heroku Environment

} else if ( currentDomain.indexOf( 'staging' ) !== -1 ) {
  // @TODO: Staging Environment

} else {
  // @TODO: Production
}

tracking( { category: 'page', event: 'load', value: 'page' } );

/*
(function onLoadSDK(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  const js = d.createElement(s);
  js.id = id;
  js.src = '//your-sdk.debrain.cloud/js/sdk.js?v=1.0.0';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'debrain-jssdk'));
*/
