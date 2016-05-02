var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'gulp.*'], camelize: true}),
    del = require('del')
    ;

var appName = 'nikhil.io';
var source = 'src/';
var destination = 'dist/';
var paths = {
    vendor: {
        styles: [
            'bower_components/reset-css/reset.css'
        ],
        scripts: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery-backstretch/jquery.backstretch.min.js',
            'bower_components/tinycolor/dist/tinycolor-min.js',
            'bower_components/color-thief/dist/color-thief.min.js',
            'bower_components/instafeed.js/instafeed.min.js',
            'bower_components/progressbar.js/dist/progressbar.min.js',
        ],
        fonts: []
    },
    app: {
        styles: [
            source + '**/*.sass'
        ],
        scripts: [
            source + '**/*.coffee'
        ],
        templates: [
            source + '**/*.jade'
        ],
        images: [
            source + 'img/*.png'
        ],
        fonts: [
            source + 'fonts/**'
        ]
    }
}

// ------ Images ------

gulp.task('images', [], function() {
    return gulp.src(paths.app.images)
               .pipe(gulp.dest(destination + 'img'));
});

// ------ Fonts ------

gulp.task('fonts:vendor', [], function() {
    return gulp.src(paths.vendor.fonts)
               .pipe(gulp.dest(destination + 'fonts'));
});

gulp.task('fonts:app', [], function() {
    return gulp.src(paths.app.fonts)
               .pipe(gulp.dest(destination + 'fonts'));
});

gulp.task('fonts', ['fonts:vendor', 'fonts:app'], function() {
    return;
});

// ------ Scripts ------

gulp.task('build:scripts:vendor', [], function() {
    return gulp.src(paths.vendor.scripts)
               .pipe($.debug())
               .pipe($.uglify())
               .pipe($.concat('vendor.js'))
               .pipe(gulp.dest(destination));
});

gulp.task('build:scripts:app', [], function() {
    return gulp.src(paths.app.scripts)
               .pipe($.coffee())
               .pipe($.debug())
               .pipe($.jshint())
               .pipe($.jshint.reporter('jshint-stylish'))
               .pipe($.uglify())
               .pipe($.concat('app.js'))
               .pipe(gulp.dest(destination))
               .pipe(browserSync.reload({stream:true}));
});

gulp.task('build:scripts', ['build:scripts:vendor', 'build:scripts:app'], function() {
    var jsPaths = [destination + '/vendor.js', destination + '/app.js'];

    return gulp.src(jsPaths)
               .pipe($.debug())
               .pipe($.rimraf(jsPaths))
               .pipe($.concat(appName + '.js'))
               .pipe(gulp.dest(destination))
               .pipe(browserSync.stream());
});

// ------ Styles ------

gulp.task('build:styles:vendor', [], function() {
    return gulp.src(paths.vendor.styles)
               .pipe($.debug())
               .pipe($.cssmin())
               .pipe($.concat('vendor.css'))
               .pipe(gulp.dest(destination));
});

gulp.task('build:styles:app', [], function() {
    var sassFilter = $.filter('**/*.sass', {restore: true});
    var cssFilter = $.filter('**/*.css', {restore: true});

    return gulp.src(paths.app.styles)
               .pipe($.debug())
               .pipe(sassFilter)
               .pipe($.sass())
               .pipe(sassFilter.restore)
               .pipe($.rename('app.css'))
               .pipe($.recess({noIDs: false, strictPropertyOrder: false, noOverqualifying: false, noUnderscores: false, noUniversalSelectors: false})) // Because it's 2AM and I don't care.
               .pipe($.recess.reporter())
               .pipe($.autoprefixer())
               .pipe($.cssmin())
               .pipe(gulp.dest(destination))
               .pipe(browserSync.stream());
});

gulp.task('build:styles', ['build:styles:vendor', 'build:styles:app'], function() {
    var cssPaths = [destination + '/vendor.css', destination + '/app.css'];

    return gulp.src(cssPaths)
               .pipe($.debug())
               .pipe($.rimraf(cssPaths))
               .pipe($.concat(appName + '.css'))
               .pipe(gulp.dest(destination))
               .pipe(browserSync.stream());
});

// ------ Templates ------

gulp.task('build:templates', [], function() {
    return gulp.src(paths.app.templates)
               .pipe($.debug())
               .pipe($.jade())
               .pipe($.rename('index.html'))
               .pipe(gulp.dest(destination))
               .pipe(browserSync.reload({stream:true}));
});

// ------ Other tasks ------

gulp.task('clean', [], function() {
    del(destination);
});

gulp.task('serve', [], function() {
    browserSync.init({
        server: {
            baseDir: destination
        },
        notify: false,
        open: false
    });

    gulp.watch(paths.app.styles, ['build:styles']);
    gulp.watch(paths.app.scripts, ['build:scripts']);
    gulp.watch(paths.app.templates, ['build:templates']);
});

// ------ Main task ------

gulp.task('default', ['clean', 'fonts', 'build:styles', 'build:scripts', 'build:templates'], function() {
    return;
});
