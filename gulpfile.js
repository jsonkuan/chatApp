var gulp = require('gulp');
var live = require('gulp-live-server');
var watch = require('gulp-watch');
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
    watch(['common/img/'], { ignoreInitial: false }, function() {
        return gulp.src('')
            .pipe(dirSync('common/img/', 'mobile/www/assets/img', {printSummary: false}))
            .pipe(dirSync('common/img/', 'webb/assets/img', {printSummary: false}))
    });
    watch(['common/defaultimages/'], { ignoreInitial: false }, function() {
        return gulp.src('')
            .pipe(dirSync('common/defaultimages/', 'webb/assets/img', {printSummary: false}))
            .pipe(dirSync('common/defaultimages/', 'mobile/www/assets/img', {printSummary: false}))

    })
});

gulp.task('default', ['watchServer', 'watchCommon', 'sync']);