const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');

//watches for all .scss change in scss folder, minimizing it, set vendor prefixs and send to src/css folder
gulp.task('scss', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.reload({stream: true}))
})
//unifies required .css of all used CSS libraries in _libs.css file and send it to src/scss folder
gulp.task('css-libs', function(){
    return gulp.src([
            'node_modules/normalize.css/normalize.css',
            'node_modules/slick-carousel/slick/slick.css',
            'node_modules/animate.css/animate.css',
        ])
        .pipe(concat('_libs.scss'))
        .pipe(gulp.dest('src/scss'))
        .pipe(browserSync.reload({stream: true}))
})

//unifies all .js of all used JS libraries in libs.min.js file, minimizing it and send to src/js folder
gulp.task('js-libs', function(){
    return gulp.src('node_modules/slick-carousel/slick/slick.js')
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
        .pipe(browserSync.reload({stream: true}))
})
//watches for js files change 
gulp.task('js', function(){
    return gulp.src('src/js/*.js')
        .pipe(browserSync.reload({stream: true}))
})

//watches for html files change 
gulp.task('html', function(){
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({stream: true}))
})

//clears ./dist when task 'build' runs
gulp.task('clean', async function(){
    del.sync('dist')
})

//live reloader task
gulp.task('live-reload', function() {
    browserSync.init({
        server: {
            baseDir: "src/"
        },
    })
})

//watches for .scss, .js, .html files using relevant tasks
gulp.task('watch-files', function(){
    gulp.watch('src/scss/**/*.scss', gulp.parallel('scss'))
    gulp.watch('src/*.html', gulp.parallel('html'))
    gulp.watch('src/js/*.js'), gulp.parallel('js')
})

//starts developing local server
gulp.task('default', gulp.parallel('css-libs','scss','js-libs','live-reload', 'watch-files'))

//collects all the files necessary for production in ./dist folder
gulp.task('export', function(){
    const buildHtml = gulp.src('src/**/*.html').pipe(gulp.dest('dist'));
    const buildCss = gulp.src('src/css/**/*.css').pipe(gulp.dest('dist/css'));
    const buildJs = gulp.src('src/js/**/*.js').pipe(gulp.dest('dist/js'));
    const buildFonts = gulp.src('src/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));
    const buildImg = gulp.src('src/img/**/*.*').pipe(gulp.dest('dist/img'));

})
//clears ./dist folder and then build it again with modifide files
gulp.task('build', gulp.series('clean', 'export'));

