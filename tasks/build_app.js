'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const plumber = require('gulp-plumber');
const jetpack = require('fs-jetpack');
const bundle = require('./bundle');
const utils = require('./utils');

const concat = require('gulp-concat');
const sourcemaps = require("gulp-sourcemaps");
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const projectDir = jetpack;
const srcDir = jetpack.cwd('./src');
const destDir = jetpack.cwd('./app');

gulp.task('bundle', function () {
    return Promise.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
});

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch("./src/js/controllers/*.js", batch(function (events, done) {
        gulp.start('controllers', beepOnError(done));
    }));
     watch("./src/js/directives/*.js", batch(function (events, done) {
        gulp.start('directives', beepOnError(done));
    }));
    watch("./src/js/services/*.js", batch(function (events, done) {
        gulp.start('services', beepOnError(done));
    }));
    watch("./src/js/filters/*.js", batch(function (events, done) {
        gulp.start('filters', beepOnError(done));
    }));

    watch("./src/stylesheets/sass/**/*.scss", batch(function (events, done) {
        gulp.start('compile', beepOnError(done));
    }));
});

gulp.task('compile', function() {
    return gulp.src("./src/stylesheets/sass/**/*.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./app/browser/assets/css'))
        /*.pipe(browserSync.stream())*/;
});

gulp.task('controllers', function() {
   return gulp.src(['./src/js/controllers/*.js'])
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});

gulp.task('filters', function() {
   return gulp.src(['./src/js/filters/*.js'])
        .pipe(concat('filters.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});

gulp.task('directives', function() {
   return gulp.src(['./src/js/directives/*.js'])
        .pipe(concat('directives.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});

gulp.task('services', function() {
   return gulp.src(['./src/js/services/*.js'])
        .pipe(concat('services.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});

gulp.task('build', ['bundle', 'compile', 'environment']);
