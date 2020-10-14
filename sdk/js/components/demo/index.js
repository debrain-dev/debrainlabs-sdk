import $SDK from 'jquery';

import tplView from './templates/main.html';

const demo = {

  el: null,

  intents: {},

  // user data
  data: {},

  view: null,

  init(props) {

    const {
      el
    } = props;

    this.el = el;

    // Add global class
    if ($SDK(this.el).length > 0) {
      $SDK('html').addClass('has-sdk');
    }

    this.view = $SDK(tplView());
    this.bind();

  },

  bind() {

    // jQuery Events

    this.render();

  },

  render() {

    // Append html
    const $container = $SDK(this.el);

    $container.empty().css('opacity', '0').css('visibility', 'visible');

    $container.append(this.view);

    $container.addClass('sdk-loaded').fadeIn(500, () => {
      console.log('SDK loaded');
    });

  }

};

export default demo;
