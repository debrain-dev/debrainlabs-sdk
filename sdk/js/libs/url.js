export default {

  param(name) {

    const vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
      vars[key] = decodeURIComponent(value);
    });

    return vars[name] || '';

    /*
     const key = name.replace(/[\\[]/, '\\[').replace(/[\]]/, '\\]');
     const regex = new RegExp(`[\\?&]${key}=([^&#]*)`);
     const results = regex.exec(window.location.search);
     return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
     */
  },

  pathname() {
    return window.location.pathname;
  }

};
