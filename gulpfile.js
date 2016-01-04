var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'gulp.*'], camelize: true}),
    del = require('del')
    ;

var development_host = '0.0.0.0';
var development_port = 5000;

var paths = {
    vendor: {
        styles: [
            'bower_components/font-awesome/css/font-awesome.min.css'
        ],
        scripts: [
            'bower_components/instafeed.js/instafeed.min.js'
        ],
        fonts: [
            'bower_components/font-awesome/fonts/**'
        ]
    },
    app: {
        styles: [
            'src/**/*.sass'
        ],
        scripts: [
            'src/**/*.coffee'
        ],
        templates: [
            'src/**/*.jade'
        ]
    },
    source: 'src',
    destination: 'dist'
}

// ------ Fonts ------

gulp.task('vendor.fonts', [], function() {
    return gulp.src(paths.vendor.fonts)
               .pipe(gulp.dest(paths.destination + '/fonts'));
});

gulp.task('fonts', ['vendor.fonts'], function() {
    return;
});

// ------ Scripts ------    

gulp.task('vendor.scripts', [], function() {
    return gulp.src(paths.vendor.scripts)
               .pipe($.concat('vendor.js'))
               .pipe(gulp.dest(paths.destination + '/scripts'));
});

gulp.task('app.scripts', [], function() {
    return gulp.src(paths.app.scripts.concat(paths.app.scripts))
               .pipe($.coffee())
               .pipe($.debug())
               .pipe($.jshint())
               .pipe($.jshint.reporter('jshint-stylish'))
               .pipe($.uglify())
               .pipe($.concat('app.js'))
               .pipe(gulp.dest(paths.destination + '/scripts'));
});

gulp.task('scripts', ['vendor.scripts', 'app.scripts'], function() {
    return;
});

// ------ Styles ------

gulp.task('app.styles', [], function() {
    return gulp.src(paths.vendor.styles.concat(paths.app.styles))
               .pipe($.debug())
               .pipe($.concat('app.sass'))
               .pipe($.sass())
               .pipe($.recess({noIDs: false, strictPropertyOrder: false, noOverqualifying: false, noUnderscores: false, noUniversalSelectors: false})) // Because it's 2AM and I don't care.
               .pipe($.recess.reporter())
               .pipe($.autoprefixer())
               .pipe($.cssmin())
               .pipe($.rename('app.css'))
               .pipe(gulp.dest(paths.destination + '/styles'));
});

gulp.task('styles', ['app.styles'], function() {
    return;
});

// ------ Templates ------

gulp.task('templates', [], function() {
    return gulp.src(paths.app.templates)
               .pipe($.debug())
               .pipe($.jade())
               .pipe($.rename('index.html'))
               .pipe(gulp.dest(paths.destination));
});

// ------ Other tasks ------

gulp.task('watch', ['app.styles', 'app.scripts', 'templates'], function() {
    gulp.watch(paths.app.styles, ['app.styles']);
    gulp.watch(paths.app.scripts, ['app.scripts']);
    gulp.watch(paths.app.templates, ['app.scripts', 'templates']);
});

gulp.task('clean', [], function() {
    del(paths.destination);
});

gulp.task('serve', [], function() {
    gulp.src(paths.destination)
    .pipe($.webserver({
        host: development_host,
        port: development_port,
        livereload: true,
        directoryListing: false,
        fallback: 'index.html',
        open: false
    }));
});

// ------ Main task ------

gulp.task('default', ['clean', 'styles', 'scripts', 'templates'], function() {
    return;
});
