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

    // Container
    const $container = $SDK(this.el);

    // keep the component hidden but visible
    $container.empty().css('opacity', '0').css('visibility', 'visible');

    // append html
    $container.append(this.view);

    // show component
    $container.addClass('sdk-loaded').fadeIn(500, () => {
      console.log('SDK loaded');
    });

  }

};

// @TODO: change for your component name
export default demo;
