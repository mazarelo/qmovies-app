const gulp        = require('gulp');
const gutil = require('gulp-util');
const sass        = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require("gulp-sourcemaps");
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
// Static Server + watching scss/html files

gulp.task('watch',function(){
  /* WATCH FOR CHANGES ON CONTROLLERS AND SERVICES */
    gulp.watch("./app/browser/scripts/app/controllers/*.js" , ['controllers']);
    gulp.watch("./app/browser/scripts/app/services/*.js" , ['services']);
    gulp.watch("./app/browser/scripts/app/directives/*.js" , ['directives']);
    gulp.watch("./app/browser/scripts/app/filters/*.js" , ['filters']);
    /* WATCH FOR CHANGES ON SASS */
    gulp.watch("./app/browser/css/**/*.scss" , ['compile']);
});

gulp.task('compile', function() {
    return gulp.src("app/browser/assets/css/sass/**/*.scss")
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

/*
gulp.task('scripts', function() {
   return gulp.src(['js/app/routes.js', 'js/app/directives.js', 'js/app/filters.js', 'js/app/services.js', 'js/app/controllers.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(babel({
          presets: ['es2015']
        }).on('error', gutil.log))
       .pipe(uglify({mangle: false}).on('error', gutil.log))
       .pipe(gulp.dest('./js/'));
});
*/
gulp.task('default', ['watch']);
