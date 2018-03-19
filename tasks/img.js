import { img as config } from '../config';
import gulp from 'gulp';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import sharp from 'sharp';
import svgSprite from 'gulp-svg-sprite';
import through from 'through2';
import watch from 'gulp-watch';

import { sync as glob } from 'glob';
import { execSync as exec } from 'child_process';
import { writeFileSync as writeFile } from 'fs';
import moment from 'moment';
import { EOL } from 'os';
import { basename } from 'path';

gulp.task('img', ['img-optimize', 'img-svg-sprite']);

/**
 * Task: Image: optimizer
 */
gulp.task('img-optimize', ['img-svg-sprite', 'img-puv-logos'], () => {
    return gulp.src(config.src.all)
        .pipe(changed(config.dist.base))
        .pipe(imagemin())
        .pipe(gulp.dest(config.dist.base));
});

/**
 * Task: Image: SVG prite creator
 */
gulp.task('img-svg-sprite', () => {
    return gulp.src(config.src.imgSprite)
        .pipe(svgSprite(config.svgSpriteConfig))
        .pipe(gulp.dest(config.dist.spriteBase));
});

/**
 * Task: Image: PUV Logo's resizer
 */
gulp.task('img-puv-logos', () => {
    return gulp.src(config.src.puvLogos)
        .pipe(gulpImageResizer(config.sharpOps))
        .pipe(gulp.dest(config.dist.puvLogosBase));
});

/**
 * Task: Image: Generate sizes for all the PUV Logo's in CSV format
 */
gulp.task('img-generate-puv-logos-sizes-csv', () => {

    const re = /(.+\.png): .+, (\d+) x (\d+), .+/;
    const tpl = (n, w, h) => `"${n}";"${w}";"${h}"`;

    // CSV Header row
    let out = '';
    out += tpl('ID', 'Width', 'Height');
    out += EOL;

    // CSV Data rows
    out +=
        glob('./src/static/img/puv-logos/*.png')
        .map(file => exec(`file ${file}`).toString())
        .map(line => line.match(re))
        .map(([, name, width, height]) => tpl(basename(name), width, height))
        .reduce((prev, next) => prev + EOL + next);

    const now = moment().format('YYYY-MM-DD-HH-mm-ss');
    const filename = `puv-logos-sizes-${now}.csv`;
    writeFile(filename, out);
    process.stdout.write(`Created file: ${filename}${EOL}`);

});

/**
 * Task: Image: Watcher
 */
gulp.task('img-watch', cb => {
    watch([config.src.all], () => gulp.start(['img'], cb));
});

/**
 * A homegrown gulp plugin to resize images with Sharp
 * @param {Function} sharpOps
 * @returns {stream.Transform}
 */
function gulpImageResizer(sharpOps) {
    return through.obj((file, enc, callback) => {
        sharpOps(sharp, file.contents)
            .then(buffer => {
                file.contents = buffer;
                callback(null, file);
            })
            .catch(err => callback(err));
    });
}
