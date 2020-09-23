/* global ga */

import $SDK from 'jquery';

// Send tracking
// Detect if Google Analytics is not installed.
if (typeof window.ga !== 'function') {

  // Snipper.
  /* eslint-disable */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  /* eslint-enable */

}

setTimeout( () => {
  window.ga('create', 'UA-177551352-1', 'auto', 'SDK');
  window.ga('SDK.send', 'pageview');
}, 100);

function tracking(props) {

  // eslint-disable-next-line camelcase
  const log_SessionID = window.sessionStorage.getItem('sdk-session-id');
  const source = window.sessionStorage.getItem('sdk-utm-source') || '';
  const campaign = window.sessionStorage.getItem('sdk-utm-campaign') || '';
  const medium = window.sessionStorage.getItem('sdk-utm-medium') || '';
  const term = window.sessionStorage.getItem('sdk-utm-term') || '';
  const content = window.sessionStorage.getItem('sdk-utm-content') || '';
  const logUrl = document.location.href;

  const {
    category,
    event,
    value
  } = props || {};

  if (category && event && value) {
    try {
      ga('SDK.send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: event,
        eventLabel: value
      });
    } catch (e) {
      console.log('Jägermeister ChatBot: GA is not available.');
    }
  }

  const dataToSend = {
    log_URL: logUrl,
    log_SessionID,
    log_UTMSource: source,
    log_UTMCampaign: campaign,
    log_UTMMedium: medium,
    log_UTMTerm: term,
    log_UTMContent: content
  };

  const merged = { ...props, ...dataToSend };

  $SDK
    .ajax({
      method: 'POST',
      url: 'https://tracking.debrain.cloud/track.php',
      data: {
        project_name: 'JaggermeisterChatBot',
        event_name: `${event}-${value}`,
        project_variant: 'JAGCB',
        params_object: JSON.stringify(merged),
        action_label: JSON.stringify(value)
      }
    })
    .fail( (xhr, status, msg) => {
      console.log(`error msg: ${msg}`);
    });

}

export default tracking;
