'use strict';

// Renames files for browser caching purposes
module.exports = {
  dist: {
    src: [
      '<%= yeoman.dist %>/client/!(bower_components){,*/}*.{js,css}',
      '!<%= yeoman.dist %>/client/ammo.js',
      '!<%= yeoman.dist %>/client/physijs_worker.js',
      '<%= yeoman.dist %>/client/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
    ]
  }
};
