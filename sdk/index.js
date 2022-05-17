// See package.json -> version
import $SDK from 'jquery';
import tracking from './libs/tracking';

const version = process.env.VERSION;

// Production
let SDKStyles = 'https://yourdomain.com/css/sdk.css';
let SDKMain = 'https://yourdomain/js/main.js';

const currentDomain = window.location.href;

if ( currentDomain.indexOf( 'localhost' ) !== -1 ) {

  // Local Environment
  SDKStyles = '/css/sdk.css';
  SDKMain = '/js/main.js';

} else if ( currentDomain.indexOf( '192.168' ) !== -1 || currentDomain.indexOf( '127.0.0.1' ) !== -1 ) {

  // Local Environment
  SDKStyles = '/css/sdk.css';
  SDKMain = '/js/main.js';

} else if ( currentDomain.indexOf( 'herokuapp' ) !== -1 ) {

  // Heroku Environment
  SDKStyles = '/css/sdk.css';
  SDKMain = '/js/main.js';

} else if ( currentDomain.indexOf( 'staging' ) !== -1 ) {

  SDKStyles = '/css/sdk.css';
  SDKMain = '/js/main.js';

}

// Sino está jquery se vuelve variable global
if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
  window.jQuery = $SDK;
  window.$ = $SDK;
}

$SDK('body').on('click', '[data-ga]', (e) => {

  const $current = $(e.currentTarget);
  tracking({
    category: $current.attr('data-ga'),
    event: $current.attr('data-ga-event'),
    value: $current.attr('data-ga-value')
  });

});

// Append Styles
document
  .querySelector('head')
  .innerHTML += `<link id="sdk-styles" rel="stylesheet" href="${SDKStyles}?v=${version}" type="text/css"/>`;

// Load the SDK main
(function onLoadSDK(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  const js = d.createElement(s);
  js.id = id;
  js.src = `${SDKMain}?v=${version}`;
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'debrain-sdk'));

/*
(function onLoadSDK(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  const js = d.createElement(s);
  js.id = id;
  js.src = 'https://yourdouamin.com/js/sdk.js?v=1.0.0';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'debrain-jssdk'));
*/
