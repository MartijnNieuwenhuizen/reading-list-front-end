import { css as config } from '../config';
import autoprefixer from 'autoprefixer';
import { reload } from 'browser-sync';
import gulp from 'gulp';
import filter from 'gulp-filter';
import cleanCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import watch from 'gulp-watch';
import stylelint from 'gulp-stylelint';
import sassGlob from 'gulp-sass-glob';

/**
 * Task: CSS Compile
 */
gulp.task('css', () => {
    const postcssProcessors = [
        autoprefixer({
            browsers: config.autoprefixer.browsers
        })
    ];

    return gulp.src(config.src.main)
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(postcss(postcssProcessors))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist.base))
        .pipe(filter('**/*.css'))
        .pipe(reload({ stream: true }));
});

/**
 * Task: CSS Watch
 */
gulp.task('css-watch', cb => {
    watch([config.src.staticAll, config.src.components], () => gulp.start(['css'], cb));
});

/**
 * Task: CSS Lint
 */
gulp.task('css-lint', () => {
    return gulp.src([
        config.src.staticAll,
        config.src.components,
        `!${config.src.vendor}`,
        `!${config.src.sprite}`
    ])
        .pipe(stylelint({
            failAfterError: true,
            reporters: [
                {
                    formatter: 'string',
                    console: true
                }
            ]
        }));
});
