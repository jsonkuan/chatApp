'use strict';

var gulp = require('gulp');
var live = require('gulp-live-server');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var dirSync = require( 'gulp-directory-sync');



gulp.task('watchServer', function() {
    var server = live.new('index.js');

    server.start();

    gulp.watch('index.js', function() {
        server.start.apply(server);
    });
});

gulp.task('watchCommon', function() {
    gulp.watch('common/common.js', function() {
        gulp.src('common/common.js')
        .pipe(gulp.dest('webb'))
        .pipe(gulp.dest('mobile/www'));
    });    
});

gulp.task( 'sync', function() {
    watch(['common/images/'], { ignoreInitial: false }, function() {
        return gulp.src('')
            .pipe(dirSync('common/images/', 'mobile/www/img', {printSummary: false}))
            .on('error', gutil.log);
    })
} );

gulp.task( 'sync2', function() {
    watch(['common/images/'], { ignoreInitial: false }, function() {
        return gulp.src('')
            .pipe(dirSync('common/images/', 'webb/assets/images', {printSummary: false}))
            .on('error', gutil.log);
    })
} );

gulp.task('default', ['watchServer', 'watchCommon', 'sync','sync2']);