
var gulp = require('gulp');
var live = require('gulp-live-server');
var watch = require('gulp-watch');

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


gulp.task('watchImages', function() {
    var path = 'common/images/*.{gif,jpg,jpeg,png,svg}';
    return watch([path], { ignoreInitial: false }, function() {
        gulp.src(path)
        .pipe(gulp.dest('webb/assets/images'))
        .pipe(gulp.dest('mobile/www/img'));
    });
});

gulp.task('default', ['watchServer', 'watchCommon', 'watchImages']);