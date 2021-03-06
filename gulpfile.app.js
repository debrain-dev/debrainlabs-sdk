const gulpBase = require('./gulp.base');

gulpBase({

  server: {
    proxy: 'localhost:5000'
  },

  scripts: {
    files: [
      'public/**/*.js',
      'app/views/**/*.html'
    ]
  },

  sass: {
    files: [
      'sdk/scss/**/*.scss'
    ],
    includePaths: [
      './',
      './node_modules/foundation-sites/scss',
      './node_modules/@mdi/font/scss',
      './node_modules/swiper'
    ],
    output: './public/css'
  }

});
