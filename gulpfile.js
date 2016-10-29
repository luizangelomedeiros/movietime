/* INICIALIZANDO VARIÁVEIS */
var app,
    dist,
    concat,
    gulp,
    gutil,
    sass,
    uglify,
    imagemin,
    minifyCSS,
    browserSync,
    autoprefixer,
    ftp,
    merge,
    htmlmin,
    plumber;

/* LISTA DE NAVEGADORES SUPORTE - AUTOPREFIXER*/
var autoPrefixBrowserList = [
    'last 2 version',
    'safari 5',
    'ie 8',
    'ie 9',
    'opera 12.1',
    'ios 6',
    'android 4'
];

/* CARREGANDO DEPENDÊNCIAS */
app         = "app/";
dist        = "dist/";
gulp        = require('gulp');
gutil       = require('gulp-util');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
sass        = require('gulp-sass');
imagemin    = require('gulp-imagemin');
minifyCSS   = require('gulp-minify-css');
autoprefixer= require('gulp-autoprefixer');
plumber     = require('gulp-plumber');
htmlmin     = require('gulp-htmlmin');
browserSync = require('browser-sync');
ftp         = require('vinyl-ftp');
merge       = require('merge-stream');

/* ATUALIZA BROWSER */
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: dist
        },
        options: {
            reloadDelay: 250
        },
        notify: true
    });
});

/* COMPRIMIR IMAGENS */
gulp.task('images', function() {
    return gulp.src([app+'images/*.jpg', app+'images/*.png'])
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(dist+'images'));
});

/* COMPRIMIR SCRIPTS */
gulp.task('scripts', function() {
    var libs = gulp.src(app+'js/lib/*.js')
        .pipe(plumber())
        .pipe(concat('libs-angular.min.js'))
        .pipe(uglify())      
        .on('error', gutil.log)
        .pipe(gulp.dest(dist+'js/min/'));

    var controllers = gulp.src(app+'js/controllers/*.js')
        .pipe(plumber())
        .pipe(concat('controllers.min.js'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest(dist+'js/min/'));

    var directives = gulp.src(app+'js/directives/*.js')
        .pipe(plumber())
        .pipe(concat('directives.min.js'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest(dist+'js/min/'));
    
    var services = gulp.src(app+'js/services/*.js')
        .pipe(plumber())
        .pipe(concat('services.min.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest(dist+'js/min/'));
    
    var main = gulp.src(app+'js/*.js')
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest(dist+'js/min/'));
    
    return merge(libs, controllers, directives, services, main);
});

/* COMPILA E UNE CSS'S */
gulp.task('styles', function() {
    var css = gulp.src(app+'css/*.css')
        //Pega os erros
        .pipe(plumber({
          errorHandler: function (err) {
            console.log(err);
            this.emit('end');
          }
        }))    
        // Log de erros
        .on('error', gutil.log)
        // concatena arquivos sass
        .pipe(concat('styles.css'));

    var scss = gulp.src(app+'scss/init.scss')
        //Pega os erros
        .pipe(plumber({
          errorHandler: function (err) {
            console.log(err);
            this.emit('end');
          }
        }))
        // Compila Sass
        .pipe(sass({
              errLogToConsole: true,
              includePaths: [
                  app+'scss/'
              ]
        }))
        // insere os prefixos
        .pipe(autoprefixer({
           browsers: autoPrefixBrowserList,
           cascade:  true
        }))
        // Log de erros
        .on('error', gutil.log)
        // concatena arquivos sass
        .pipe(concat('styles.scss'));

    var merged = merge(scss, css)
        // concatena todos css's
        .pipe(concat('styles.min.css'))
        // minifica css geral
        .pipe(minifyCSS())
        // salva css final
        .pipe(gulp.dest(dist+'css/min/'))
        // notifica browserSync para dar recarregar pg
        .pipe(browserSync.reload({stream: true}));
    
    return merged;
});

/* COMPRIMIR HTML */
gulp.task('html', function() {
    return gulp.src(app+'*.html')
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}))
        .on('error', gutil.log);
});

/* COMPRIMIR HTML */
gulp.task('copy', function() {
    var partials = gulp.src(app+'partials/*.html')
    .pipe(gulp.dest(dist+'/partials/'));
   
    var directives = gulp.src(app+'js/directives/*.html')
    .pipe(gulp.dest(dist+'/js/directives/'));

    return merge(partials,directives);
});

/* TASK DEFAULT */
gulp.task('default', ['browserSync', 'scripts', 'styles', 'copy'], function() {
    gulp.watch(app+'js/**', ['scripts']);
    gulp.watch(app+'styles/scss/**', ['styles']);
    gulp.watch(app+'images/**', ['images']);
    gulp.watch(app+'*.html', ['html']);
});