'use strict';

// Подключение модулей
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    csslint = require('gulp-csslint'),
    imagemin = require('gulp-imagemin'),
    eslint = require('gulp-eslint'),
    htmlhint = require('gulp-htmlhint'),
    rename = require('gulp-rename'),
    uncss = require('gulp-uncss'),
    spritesmith = require('gulp.spritesmith'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// Пути сборщика
var path = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        sprite: 'src/tmp/'
    },
    src: {
        html: 'src/**/*.html',
        js: [
            'src/js/libs/jquery/dist/jquery.js',
            'src/js/libs/bootstrap/dist/js/bootstrap.min.js',
            'src/js/libs/jquery.parallax/jquery.parallax.js',
            'src/js/libs/jquery.isotope.js',
            'src/js/libs/imagesloaded.pkgd.js',
            'src/js/libs/jquery.sticky/jquery.sticky.js',
            'src/js/libs/smooth-scroll/smooth-scroll.js',
            'src/js/libs/wow/dist/wow.min.js',
            'src/js/libs/jquery.easy-pie-chart/dist/jquery.easypiechart.js',
            'src/js/libs/waypoints/lib/jquery.waypoints.min.js',
            'src/js/libs/jquery.cbpQTRotator.js',
            'src/js/libs/nanoscroller/bin/javascripts/jquery.nanoscroller.js',
            'src/js/libs/modernizr.custom.js',
            'src/js/libs/typed.js/lib/typed.min.js',
            'src/js/*.js',
        ],
        style: [
            'src/js/libs/bootstrap/dist/css/bootstrap.min.css',
            'src/js/libs/animate.css/animate.css',
            'src/js/libs/nanoscroller/bin/css/nanoscroller.css',
            /*'src/js/libs/fontawesome/css/font-awesome.min.css',*/
            'src/style/font-awesome.min.css',
        ],
        scss: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        sprite: 'src/sprite/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        sprite: 'src/sprite/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    lint: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
    },
    clean: './dist'
};

gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: './dist' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});


// Task:сборка проекта
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true}))


});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}))


});

gulp.task('style:build', function () {

    var sassStream = gulp.src(path.src.scss);
    var cssStream = gulp.src(path.src.style);

    return merge(sassStream, cssStream)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(concat('styles.css'))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}))


});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({stream: true}))


});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.reload({stream: true}))

});

gulp.task('sprite:build', function () {
    var spriteData =
        gulp.src(path.src.sprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                imgPath: '../img/sprite.png'
            }));

    spriteData.img.pipe(gulp.dest(path.build.img));
    spriteData.css.pipe(gulp.dest(path.build.sprite));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'sprite:build'
]);

// Task:проверка проекта
gulp.task('html:lint', function () {
    gulp.src(path.lint.html)
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter())
});

gulp.task('js:lint', function () {
    gulp.src(path.lint.js)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('style:lint', function () {
    gulp.src(path.lint.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(csslint())
        .pipe(csslint.formatter());
});

gulp.task('lint', [
    'html:lint',
    'js:lint',
    // 'style:lint',
]);

// Task:проверка изменений файлов
gulp.task('watch', function () {
    watch(['browser-sync', path.watch.html], function (event, cb) {
        gulp.start('html:build', browserSync.reload);
        gulp.start('html:lint');
    });
    watch(['browser-sync', path.watch.style], function (event, cb) {
        gulp.start('style:build', browserSync.reload);
        // gulp.start('style:lint');
    });
    watch(['browser-sync', path.watch.js], function (event, cb) {
        gulp.start('js:build', browserSync.reload);
        gulp.start('js:lint');
    });
    watch(['browser-sync', path.watch.img], function (event, cb) {
        gulp.start('image:build', browserSync.reload);
    });
    watch(['browser-sync', path.watch.sprite], function (event, cb) {
        gulp.start('sprite:build', browserSync.reload);
    });
    watch(['browser-sync', path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build', browserSync.reload);
    });
});


// Task:очистка файлов
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


// Task:default
gulp.task('default', ['build', 'browser-sync', 'watch', 'lint']);