const gulp        = require('gulp');
//const gutil = require('gulp-util');
const sass        = require('gulp-sass');
//const babel = require('gulp-babel');
// Static Server + watching scss/html files
gulp.task('serve', ['compile'], function() {
    gulp.watch(["**/*.scss"], ['compile']);
});

gulp.task('compile', function() {
    return gulp.src("src/assets/css/sass/**/*.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('src/assets/css'))
        /*.pipe(browserSync.stream())*/;
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
gulp.task('default', ['serve']);
