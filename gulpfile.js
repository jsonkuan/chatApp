
var gulp = require('gulp');
var live = require('gulp-live-server');
var watch = require('gulp-watch');

gulp.task('serve', function(){
    var server = live.new('index.js');
    server.start();

    gulp.watch('index.js', function(){
        server.start.apply(server);
    });

    gulp.watch('common/common.js', function(){
        gulp.src('./common/common.js').pipe(gulp.dest('./webb'));
        gulp.src('./common/common.js').pipe(gulp.dest('./mobile/www'));
        server.start.apply(server);
    });

    watch('./common/images/**/*.{ttf,woff,eof,svg,png,jpeg}', function(){
        gulp.src('./common/images/**/*.{ttf,woff,eof,svg,png}').pipe(gulp.dest('./mobile/www/img'));
        gulp.src('./common/images/**/*.{ttf,woff,eof,svg,png}').pipe(gulp.dest('./webb/assets/images'));
        server.start.apply(server);
    });

});


