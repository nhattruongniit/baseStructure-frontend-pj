var gulp = new require('gulp');
var browserSync = new require('browser-sync');
var reload = browserSync.reload;
var sass = new require('gulp-sass');
var cssmin = new require('gulp-cssmin');
var rename = new require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = new require('gulp-autoprefixer');
var gulpSequence = require('gulp-sequence');
var plumber = require('gulp-plumber');

function plumberError(error) {
    console.log(error.toString());

    this.emit('end');
}

/*
| JS tasks
|--------------------------------------------------------------------------
*/
gulp.task('js--concat', function () {
    return gulp.src('../frontend/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('../public/assets/js/'));
});
gulp.task('js--concat--watch', function () {
    gulp.watch('../frontend/js/**/*.js', ['js--concat', reload]);
});
gulp.task('js--uglify', function () {
    return gulp.src('../public/assets/js/app.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../public/assets/js/'));
});
gulp.task('js--uglify--watch', function () {
    gulp.watch([
        '../public/assets/js/*.js',
        '!../public/assets/js/*.min.js'
    ], ['js--uglify', reload]);
});
gulp.task('js', gulpSequence('js--concat', 'js--uglify'));
gulp.task('js--watch', ['js--concat--watch', 'js--uglify--watch']);

/*
| CSS tasks
|--------------------------------------------------------------------------
*/
gulp.task('css--sass', function () {
    return gulp.src('../frontend/sass/**/*.scss')
        .pipe(plumber({
            errorHandler: plumberError
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(gulp.dest('../public/assets/css/'))
        .pipe(browserSync.stream());
});
gulp.task('css--sass--watch', function () {
    gulp.watch('../frontend/sass/**/*.scss', ['css--sass'])
});
gulp.task('css--minify', function () {
    return gulp.src([
        '../public/assets/css/*.css',
        '!../public/assets/css/*.min.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../public/assets/css/'))
        .pipe(browserSync.stream())
});
gulp.task('css--minify--watch', function () {
    gulp.watch([
        '../public/assets/css/*.css',
        '!../public/assets/css/*.min.css'
    ], ['css--minify'])
});
gulp.task('css', gulpSequence('css--sass', 'css--minify'));
gulp.task('css--watch', ['css--sass--watch', 'css--minify--watch']);

/*
| Other tasks
|--------------------------------------------------------------------------
*/
gulp.task('html--watch', function () {
    gulp.watch('../public/**/*.html').on('change', reload);
});
gulp.task('watch', ['js--watch', 'css--watch']);

gulp.task('server', ['js--watch', 'css--watch', 'html--watch'], function () {
    browserSync.init({
        server: {
            baseDir: "../public/"
        }
    });
});

gulp.task('default', ['js', 'css']);
