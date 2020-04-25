var gulp=require('gulp'),
    plumber=require('gulp-plumber'),
    del=require('del'),
    browserSync=require('browser-sync').create(),
    postcss=require('gulp-postcss'),
    autoprefixer=require('autoprefixer'),
    sass=require('gulp-sass');

sass.compiler = require('node-sass');

//清除dist下的所有文件
gulp.task('clean',function(callback){
    return del('./dist/',callback)
});

//编译sass文件
gulp.task('sass',function(){
    return gulp.src('./src/styles/**/*.scss')
                .pipe(postcss([autoprefixer()]))
                .pipe(sass({
                    outputStyle:'expanded',
                    includePaths:[
                        'node_modules/susy/sass',
                         require('bourbon').includePaths,
                         'node_modules/normalize-scss/sass'
                    ]
                }).on('error',sass.logError))
                .pipe(plumber())
                .pipe(gulp.dest('./dist/css/'))
                .pipe(browserSync.stream());
});

// html、image、js都移动到dist文件夹
gulp.task('package',function(){
    return gulp.src(['./src/*.html', './src/images*/**/*.*', './src/js*/**/*.*'])
                .pipe(gulp.dest('./dist/'))
                .pipe(browserSync.stream());
});

gulp.task('build',gulp.parallel('sass','package'));

//启动服务器
gulp.task('serve',function(){
    browserSync.init({
        server:{
            baseDir:"./dist/"
        },
        port:8085
    });
});

//监视指定文件，当用户修改文件时，即时刷新浏览器
gulp.task('watch',function(){
    gulp.watch(['./src/*.html','./src/**/*.scss'],gulp.series('build')).on('change',browserSync.reload);
});

gulp.task('default',gulp.series('clean','build',gulp.parallel('serve','watch')));