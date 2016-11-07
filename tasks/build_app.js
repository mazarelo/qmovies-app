'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');

const concat = require('gulp-concat');
const sourcemaps = require("gulp-sourcemaps");
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');

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

    watch("./app/browser/scripts/app/controllers/*.js", batch(function (events, done) {
        gulp.start('controllers', beepOnError(done));
    }));
     watch("./app/browser/scripts/app/directives/*.js", batch(function (events, done) {
        gulp.start('directives', beepOnError(done));
    }));
    watch("./app/browser/scripts/app/services/*.js", batch(function (events, done) {
        gulp.start('services', beepOnError(done));
    }));
    watch("./app/browser/scripts/app/filters/*.js", batch(function (events, done) {
        gulp.start('filters', beepOnError(done));
    }));

    watch("./app/browser/assets/css/sass/**/*.scss", batch(function (events, done) {
        gulp.start('compile', beepOnError(done));
    }));
});

gulp.task('compile', function() {
    return gulp.src("./app/browser/assets/css/sass/**/*.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./app/browser/assets/css'))
        /*.pipe(browserSync.stream())*/;
});

gulp.task('controllers', function() {
   return gulp.src(['./app/browser/scripts/app/controllers/*.js'])
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});

gulp.task('filters', function() {
   return gulp.src(['./app/browser/scripts/app/filters/*.js'])
        .pipe(concat('filters.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});

gulp.task('directives', function() {
   return gulp.src(['./app/browser/scripts/app/directives/*.js'])
        .pipe(concat('directives.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});

gulp.task('services', function() {
   return gulp.src(['./app/browser/scripts/app/services/*.js'])
        .pipe(concat('services.js'))
        .pipe(gulp.dest('./app/browser/scripts/app/'));
});


gulp.task('build', ['bundle', 'compile', 'environment']);
