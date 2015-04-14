'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

gulp.task('spec', function() {
  return gulp.src('test/spec/*.js')
  .pipe(jasmine());
});

// Test Page
gulp.task('test', function() {
  // JavaScript
  browserify({entries: './test/js/test_page.js',
              debug: true,
              standalone: 'test_script'
             }).bundle()
  .pipe(source('test.js'))
  .pipe(rename('test_page_bundle.js'))
  .pipe(gulp.dest('dist/test/'))
  .pipe(streamify(uglify()))
  .pipe(notify("Done with building code for testing."))

  // Unit tests
  gulp.start('spec');

  // Copy over the HTML.
  gulp.src('test/index.html')
  .pipe(gulp.dest('dist/test/'));

  // Copy over the data.
  gulp.src('test/data/**')
  .pipe(gulp.dest('dist/test/'));
});

gulp.task('prod', function() {
  browserify('./src/js/main.js',
             {standalone: 'oncoprint'}).bundle()
  .pipe(source('oncoprint-bundle.js'))
  .pipe(streamify(uglify()))
  .pipe(gulp.dest('dist/prod/'))
  .pipe(notify("Done with generating production code."));

  // Copy over the HTML.
  gulp.src('src/index.html')
  .pipe(gulp.dest('dist/prod/'));
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist'], cb)
});

// Default
gulp.task('default', ['clean'], function() {
    gulp.start('prod');
});

// Watch
gulp.task('watch', function() {
  gulp.watch(['src/js/**/*.js', 'test/*.html', 'test/js/**/*.js', 'test/spec/*.js'], ['test']);
});
