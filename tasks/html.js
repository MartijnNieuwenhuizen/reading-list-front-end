import { html as config, nunjucksOptions } from '../config';
import { reload as browsersync } from 'browser-sync';
import gulp from 'gulp';
import data from 'gulp-data';
import render from 'gulp-nunjucks-render';
import watch from 'gulp-watch';
import { swallowError } from '../tasks/util/generic';
import { getViewModel } from './util/html';

/**
 * Task: HTML Compile
 */
gulp.task('html', () => {
    return gulp.src(config.src.templates)
        .pipe(data(getViewModel))
        .on('error', swallowError)
        .pipe(render({
            envOptions: nunjucksOptions,
            path: [
                config.src.templatesDir,
                config.src.layoutDir,
                config.src.componentsDir
            ]
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(config.dist.base))
        .on('end', () => browsersync());
});

/**
 * Task: HTML Watch
 */
gulp.task('html-watch', cb => {
    const paths = config.src;
    watch([paths.templates, paths.layout, paths.components, paths.componentsJSON],
        () => gulp.start(['html'], cb));
});

