const { src, dest, watch, series, parallel } = require('gulp');

const sass                      = require('gulp-sass')(require('sass'));
const sourcemaps                = require('gulp-sourcemaps');
const concat                    = require('gulp-concat');
const babel                     = require('gulp-babel');
const postcss                   = require('gulp-postcss');
const cssnano                   = require('cssnano');
const replace                   = require('gulp-replace');
const uglify                    = require('gulp-uglify');
const fileinclude               = require('gulp-file-include');
const discardComments           = require('postcss-discard-comments');
const rename                    = require('gulp-rename');

// File source paths
const projetName = 'projet_name'
const projetSource = 'src/'
const projetSourceName = projetSource + projetName

const files = { 
    scssPath: projetSourceName + '/assets/sass/**/*.scss',
    jsPath: projetSourceName + '/assets/js/**/*.js',
    htmlPath: projetSourceName + '/**/*.html',
    faFontPath: 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
    fontPath: projetSourceName + '/assets/fonts/*',
    imgJpgPath: projetSourceName + '/assets/imgs/**/*.{jpg,jpeg}',
    imgPath: projetSourceName + '/assets/imgs/**/*.{gif,png,svg}',
}

// File destination paths
const projetDestName = projetName
const projetDestination = 'dist/' + projetDestName

const destination = {
    projetDist: projetDestination,
    projetSrc: projetSourceName
}

// exportation d'image Other
async function imagesOtherTask() {
    const imagemin = await import('gulp-imagemin').then(mod => mod.default || mod); // Utilisation de import() de manière dynamique
    const gifsicle = await import('imagemin-gifsicle').then(mod => mod.default || mod);
    const mozjpeg = await import('imagemin-mozjpeg').then(mod => mod.default || mod);
    const optipng = await import('imagemin-optipng').then(mod => mod.default || mod);
    const svgo = await import('imagemin-svgo').then(mod => mod.default || mod);

    return src(files.imgPath)
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 90, progressive: true }),
            optipng({ optimizationLevel: 5 }),
            svgo({
                plugins: [
                    { name: 'removeViewBox', active: true },
                    { name: 'cleanupIDs', active: false }
                ]
            })
        ]))
        .pipe(dest(destination.projetDist + '/assets/imgs')
    );
}

// exportation d'image Low
async function imagesLowTask() {
    const imagemin = await import('gulp-imagemin').then(mod => mod.default || mod); // Utilisation de import() de manière dynamique
    const gifsicle = await import('imagemin-gifsicle').then(mod => mod.default || mod);
    const mozjpeg = await import('imagemin-mozjpeg').then(mod => mod.default || mod);
    const optipng = await import('imagemin-optipng').then(mod => mod.default || mod);
    const svgo = await import('imagemin-svgo').then(mod => mod.default || mod);

    return src(files.imgJpgPath)
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 20, progressive: true }),
            optipng({ optimizationLevel: 5 }),
            svgo({
                plugins: [
                    { name: 'removeViewBox', active: true },
                    { name: 'cleanupIDs', active: false }
                ]
            })
        ]))
        .pipe(rename({
            suffix: "-20",
        }))
        .pipe(dest(destination.projetDist + '/assets/imgs')
    );
}


// exportation d'image High
async function imagesHighTask() {
    const imagemin = await import('gulp-imagemin').then(mod => mod.default || mod); // Utilisation de import() de manière dynamique
    const gifsicle = await import('imagemin-gifsicle').then(mod => mod.default || mod);
    const mozjpeg = await import('imagemin-mozjpeg').then(mod => mod.default || mod);
    const optipng = await import('imagemin-optipng').then(mod => mod.default || mod);
    const svgo = await import('imagemin-svgo').then(mod => mod.default || mod);

    return src(files.imgJpgPath)
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 90, progressive: true }),
            optipng({ optimizationLevel: 5 }),
            svgo({
                plugins: [
                    { name: 'removeViewBox', active: true },
                    { name: 'cleanupIDs', active: false }
                ]
            })
        ]))
        .pipe(rename({
            suffix: "-90",
        }))
        .pipe(dest(destination.projetDist + '/assets/imgs')
    );
}

// exportImg task
function images(){
    build(files.imgPath, imgJpgPath,     
        {interval: 200, usePolling: true}, //Makes docker work
        series(
            imagesLowTask, imagesHighTask, imagesOtherTask
        )
    );
}

exports.images = series(
    imagesLowTask, imagesHighTask, imagesOtherTask
);

// Sass task
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ cssnano() ])) // PostCSS plugins
        .pipe(postcss([discardComments()])) // discardComments plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest(destination.projetDist + '/assets/css')
    ); // put final CSS in dist folder
}

// JS task
function jsTask(){
    return src([files.jsPath])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(destination.projetDist + '/assets/js')
    );
}

// html Cachebust
function cacheBustTask(){
    var cbString = new Date().getTime();
    return src(
        [
            projetSourceName + '/*.html'
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        // .pipe(stripCssComments())    
        .pipe(dest(destination.projetDist));
}

function fontTask(){
    return src(files.fontPath)
    .pipe(dest(destination.projetDist + '/assets/fonts'));
}

// vendor jQuery 
function jQueryTask(){
    return src('node_modules/jquery/dist/jquery.min.js')
    .pipe(dest(destination.projetDist + '/assets/vendor/jquery'));
}

// vendor bootstrap js 
function bootstrapJsTask(){
    return src([
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js.map'
    ])
    .pipe(dest(destination.projetDist + '/assets/vendor/bootstrap'));
}
// vendor bootstrap js 
function bootstrapSassTask(){
    return src([
        'node_modules/bootstrap/scss/*.*'
    ])
    .pipe(dest(destination.projetSrc + '/assets/vendor/bootstrap'));
}

// vendor malihu-custom-scrollbar 
function customScrollbarTask(){
    return src('node_modules/malihu-custom-scrollbar-plugin-3.1.7/jquery.mCustomScrollbar.js')
    .pipe(dest(destination.projetDist + '/assets/vendor/malihu-custom-scrollbar'));
}

// vendor malihu-custom-scrollbar 
function customScrollbarSassTask(){
    return src('node_modules/malihu-custom-scrollbar-plugin-3.1.7/jquery.mCustomScrollbar.css')
    .pipe(dest(destination.projetSrc + '/assets/vendor/malihu-custom-scrollbar'));
}

// vendor lazysizeTask 
function lazysizeTask(){
    return src('node_modules/lazysizes/lazysizes.min.js')
    .pipe(dest(destination.projetDist + '/assets/vendor/lazysize'));
}

// vendor lodashTask
function lodashTask(){
    return src('node_modules/lodash/lodash.min.js')
    .pipe(dest(destination.projetDist + '/assets/vendor/lodash'));
}

// vendor slick-carousel
function slickTask(){
    return src([
        'node_modules/slick-slider/slick/fonts/**',
        'node_modules/slick-slider/slick/slick.min.js',
        'node_modules/slick-slider/slick/ajax-loader.gif'
    ])
    .pipe(dest(destination.projetDist + '/assets/vendor/slick'));
}

// vendor slick-carousel
function slickSassTask(){
    return src([
        'node_modules/slick-slider/slick/slick-theme.scss',
        'node_modules/slick-slider/slick/slick.scss'
    ])
    .pipe(dest(destination.projetSrc + '/assets/vendor/slick'));
}

// Watch task
function watchTask(){
    watch([files.jsPath, files.scssPath, files.htmlPath],        
        {interval: 1000, usePolling: true}, //Makes docker work
        series(
            parallel(jsTask, scssTask, cacheBustTask),
            
        )
    );
}

// Export the default Gulp task
exports.default = series(
    parallel(jsTask, scssTask, cacheBustTask),
    watchTask
);

// export all plugins : bootstrap, jquery, lodash, slick, 
function allPlugins(){
    build(files.fontPath,        
        {interval: 200, usePolling: true}, //Makes docker work
        series(
            slickTask, lodashTask, lazysizeTask, bootstrapJsTask, jQueryTask, fontTask, customScrollbarTask
        )
    );
}
exports.allPlugins = series(
    slickTask, lodashTask, lazysizeTask, bootstrapJsTask, jQueryTask, fontTask, customScrollbarTask
);

// export all plugins : bootstrap, jquery, lodash, slick, 
function allSass(){
    build(        
        {interval: 200, usePolling: true}, //Makes docker work
        series(
            slickSassTask, bootstrapSassTask, customScrollbarSassTask
        )
    );
}
exports.allSass = series(
    slickSassTask, bootstrapSassTask, customScrollbarSassTask
);

// build task
function build(){
    build([
            files.fontPath, files.scssPath, files.jsPath, files.imgPath, files.imgJpgPath, files.htmlPath
        ],        
        {
            interval: 200,
            usePolling: true
        }, //Makes docker work
        series(
            parallel(jsTask, scssTask, cacheBustTask), lazysizeTask, slickTask, lodashTask, customScrollbarTask, bootstrapJsTask, jQueryTask, cacheBustTask, fontTask, imagesLowTask, imagesHighTask, imagesOtherTask
        )
    );
}

exports.build = series(
    parallel(jsTask, scssTask, cacheBustTask), lazysizeTask, slickTask, lodashTask, customScrollbarTask, bootstrapJsTask, jQueryTask, cacheBustTask, fontTask, imagesLowTask, imagesHighTask, imagesOtherTask
);