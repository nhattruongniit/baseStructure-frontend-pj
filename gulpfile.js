var config = {
    srcDir: './frontend',
    distDir: './public/sub/path',
    distDirRoot: './public',

    srcJsFiles: 'js/**/*.js',
    distJsFilename: 'app.js',

    srcSassFiles: 'sass/**/*.scss',
    sassAutoPrefixerOptions: {
        browsers: ['last 5 versions']
    },

    srcPugSubfolderName: 'pug'
};
var beautifyConfig = {};


/*
|--------------------------------------------------------------------------
| Prepare
|--------------------------------------------------------------------------
*/


var fs = require('fs');
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
var pug = new require('gulp-pug');
var jsbeautify = require('js-beautify');
var beautify = require('./beautify');


function plumberError(error) {
    console.log(error.toString());

    this.emit('end');
}

/**
 * Join arguments by /
 * @return {string}
 */
function path() {
    var args = Array.prototype.slice.apply(arguments);

    return args.map(function (arg) {
        return arg.trim('\\/');
    }).join('/');
}

if (fs.existsSync('.jsbeautifyrc')) {
    try {
        var jsbeautifyrc = JSON.parse(fs.readFileSync('.jsbeautifyrc', 'utf8'));
        beautifyConfig = Object.assign({}, jsbeautifyrc, beautifyConfig);
    } catch (e) {
        //
    }
}

/*
| JS tasks
|--------------------------------------------------------------------------
*/
var srcJsFiles = path(config.srcDir, config.srcJsFiles);

gulp.task('js:concat', function () {
    return gulp.src(srcJsFiles)
        .pipe(concat(config.distJsFilename))
        .pipe(beautify(beautifyConfig))
        .pipe(gulp.dest(path(config.distDir, 'assets/js')));
});

gulp.task('js:concat:watch', function () {
    gulp.watch(srcJsFiles, ['js:concat', reload]);
});

gulp.task('js:minify', function () {
    return gulp.src(path(config.distDir, 'assets/js', config.distJsFilename))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(path(config.distDir, 'assets/js')));
});

gulp.task('js:minify:watch', function () {
    gulp.watch([
        path(config.distDir, 'assets/js', config.distJsFilename),
        '!' + path(config.distDir, 'assets/js', config.distJsFilename.split('.')[0] + '.min.js')
    ], ['js:minify', reload]);
});

gulp.task('js', gulpSequence('js:concat', 'js:minify'));
gulp.task('js:watch', ['js:concat:watch', 'js:minify:watch']);


/*
| CSS tasks
|--------------------------------------------------------------------------
*/

gulp.task('css:compile', function () {
    return gulp.src(path(config.srcDir, config.srcSassFiles))
        .pipe(plumber({
            errorHandler: plumberError
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(config.sassAutoPrefixerOptions))
        .pipe(beautify(Object.assign({}, beautifyConfig, {
            beautifier: jsbeautify.css
        })))
        .pipe(gulp.dest(path(config.distDir, 'assets/css')))
        .pipe(browserSync.stream());
});

gulp.task('css:compile:watch', function () {
    gulp.watch(path(config.srcDir, config.srcSassFiles), ['css:compile'])
});

gulp.task('css:minify', function () {
    return gulp.src([
        path(config.distDir, 'assets/css/**/*.css'),
        '!' + path(config.distDir, 'assets/css/**/*.min.css')
    ])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path(config.distDir, 'assets/css')))
        .pipe(browserSync.stream())
});

gulp.task('css:minify:watch', function () {
    gulp.watch([
        path(config.distDir, 'assets/css/**/*.css'),
        '!' + path(config.distDir, 'assets/css/**/*.min.css')
    ], ['css:minify'])
});

gulp.task('css', gulpSequence('css:compile', 'css:minify'));
gulp.task('css:watch', ['css:compile:watch', 'css:minify:watch']);

/*
| Other tasks
|--------------------------------------------------------------------------
*/
gulp.task('html:compile', function () {
    gulp.src([
        path(config.srcDir, config.srcPugSubfolderName, '**/*.pug'),
        '!' + path(config.srcDir, config.srcPugSubfolderName, '**/_*.pug')
    ])
        .pipe(pug({
            pretty: false
        }))
        .pipe(beautify(Object.assign({}, beautifyConfig, {
            beautifier: jsbeautify.html
        })))
        .pipe(gulp.dest(config.distDir))
        .pipe(browserSync.stream());
});

gulp.task('html:watch', function () {
    gulp.watch([
        path(config.srcDir, config.srcPugSubfolderName, '**/*.pug'),
        '!' + path(config.srcDir, config.srcPugSubfolderName, '**/_*.pug')
    ], ['html:compile', reload]);

    gulp.watch(path(config.distDir, '**/*.html')).on('change', reload);
});

gulp.task('html', ['html:compile']);

gulp.task('watch', ['js:watch', 'css:watch', 'html:watch']);

gulp.task('serve', ['watch'], function () {
    browserSync.init({
        server: {
            baseDir: config.distDirRoot
        }
    });
});

gulp.task('build', ['css', 'js', 'html']);
