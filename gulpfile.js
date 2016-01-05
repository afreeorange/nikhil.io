var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')({pattern: ['gulp-*', 'gulp.*'], camelize: true}),
    del = require('del')
    ;

var development_host = '0.0.0.0';
var development_port = 5000;

var paths = {
    vendor: {
        styles: [
            'bower_components/reset-css/reset.css',
            'bower_components/font-awesome/css/font-awesome.min.css'
        ],
        scripts: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery-backstretch/jquery.backstretch.min.js',
            'bower_components/tinycolor/dist/tinycolor-min.js',
            'bower_components/color-thief/dist/color-thief.min.js',
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
        ],
        fonts: [
            'src/fonts/**'
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

gulp.task('app.fonts', [], function() {
    return gulp.src(paths.app.fonts)
               .pipe(gulp.dest(paths.destination + '/fonts'));
});

gulp.task('fonts', ['vendor.fonts', 'app.fonts'], function() {
    return;
});

// ------ Scripts ------

gulp.task('vendor.scripts', [], function() {
    return gulp.src(paths.vendor.scripts)
               .pipe($.concat('vendor.js'))
               .pipe(gulp.dest(paths.destination + '/scripts'));
});

gulp.task('app.scripts', [], function() {
    return gulp.src(paths.app.scripts)
               .pipe($.coffee())
               .pipe($.debug())
               .pipe($.jshint())
               .pipe($.jshint.reporter('jshint-stylish'))
               .pipe($.uglify())
               .pipe($.concat('app.js'))
               .pipe(gulp.dest(paths.destination + '/scripts'))
               .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', ['vendor.scripts', 'app.scripts'], function() {
    return;
});

// ------ Styles ------

gulp.task('vendor.styles', [], function() {
    return gulp.src(paths.vendor.styles)
               .pipe($.cssmin())
               .pipe($.concat('vendor.css'))
               .pipe(gulp.dest(paths.destination + '/styles'))
               .pipe(browserSync.stream());
});

gulp.task('app.styles', [], function() {
    return gulp.src(paths.app.styles)
               .pipe($.debug())
               .pipe($.concat('app.sass'))
               .pipe($.sass())
               .pipe($.recess({noIDs: false, strictPropertyOrder: false, noOverqualifying: false, noUnderscores: false, noUniversalSelectors: false})) // Because it's 2AM and I don't care.
               .pipe($.recess.reporter())
               .pipe($.autoprefixer())
               .pipe($.cssmin(
                  {
                    'advanced': false
                  }
                ))
               .pipe($.rename('app.css'))
               .pipe(gulp.dest(paths.destination + '/styles'))
               .pipe(browserSync.stream());
});

gulp.task('styles', ['vendor.styles', 'app.styles'], function() {
    return;
});

// ------ Templates ------

gulp.task('templates', [], function() {
    return gulp.src(paths.app.templates)
               .pipe($.debug())
               .pipe($.jade())
               .pipe($.rename('index.html'))
               .pipe(gulp.dest(paths.destination))
               .pipe(browserSync.reload({stream:true}));
});

// ------ Other tasks ------

gulp.task('clean', [], function() {
    del(paths.destination);
});

gulp.task('serve', [], function() {
    browserSync.init({
        server: {
            baseDir: paths.destination
        }
    });

    gulp.watch(paths.app.styles, ['app.styles']);
    gulp.watch(paths.app.scripts, ['app.scripts']);
    gulp.watch(paths.app.templates, ['templates']);
});

// ------ Main task ------

gulp.task('default', ['clean', 'fonts', 'styles', 'scripts', 'templates'], function() {
    return;
});
