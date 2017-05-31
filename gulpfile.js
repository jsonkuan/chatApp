
var gulp = require('gulp');
var live = require('gulp-live-server');

gulp.task('serve', function(){
    var server = live.new('index.js');
    server.start();

    gulp.watch('index.js', function(){
        server.start.apply(server);
    });

    gulp.watch('common/common.js', function(){
        gulp.src('./common/common.js').pipe(gulp.dest('./webb'));
        gulp.src('./common/common.js').pipe(gulp.dest('./mobile'));
        server.start.apply(server);
    });
});


