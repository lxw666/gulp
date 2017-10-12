var gulp = require('gulp');
var $$ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var pngquant = require('imagemin-pngquant');


/**
 * js检查，转换以及压缩
 */
gulp.task('jshint',function(){
	gulp
	.src('app/src/js/*.js')
	.pipe($$.jshint())
	.pipe($$.jshint.reporter('default'));
})
gulp.task('script',function(){
	gulp
	.src('app/src/js/*.js')
	.pipe(gulp.dest('app/dist/js'))
	.pipe(reload({stream: true}));
})
gulp.task('scriptMin',function(){
	gulp
	.src('app/src/js/*.js')
	.pipe(gulp.dest('app/dist/js'))
	.pipe($$.uglify())
	.pipe(gulp.dest('app/dist/js'));
})

/**
 * sass转换以及压缩
 */
gulp.task('sass',function(){
	return $$.rubySass('app/src/sass/*.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('app/dist/css'))
        .pipe(reload({stream: true}));
})
gulp.task('sassMin',function(){
	return $$.rubySass('app/src/sass/*.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('app/dist/css'))
        .pipe($$.minifyCss()) //css压缩文件
        .pipe(gulp.dest('app/dist/css'))
        .pipe(reload({stream: true}));
})

/**
 * 图片转换以及压缩
 */
gulp.task('img',function(){
	gulp
	.src('app/src/img/*')
	.pipe(gulp.dest('app/dist/img'))
	.pipe(reload({stream: true}));
})
gulp.task('imgMIn',function(){
	gulp
	.src('app/src/img/*')
	.pipe($$.imagemin({
		progressive: true,
        use: [pngquant()]
	}))
	.pipe(gulp.dest('app/dist/img'))
	.pipe(reload({stream: true}));
})

/**
 * 自动刷新
 */
gulp.task('serve', function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch(["app/*.html","app/src"]).on('change', reload);
});

/**
 * 清除任务
 */
gulp.task('clean',function(){
	gulp
	.src(['app/dist/*','.sass-cache'],{read: false})
	.pipe($$.clean());
})

/**
 * 默认任务
 */
gulp.task('default', function(){
	gulp.run('img','sass','script','serve','jshint');
	gulp.watch('app/src/**/**', function(){
        gulp.run('img','script','sass','jshint');
    });
})

/**
 * 上生产
 */
gulp.task('online',function(){
	gulp.run('imgMIn','sassMin','scriptMin','serve','jshint');
})