import 'babel-polyfill';
import gulp from 'gulp';
import runSequence from 'run-sequence';

// Load tasks
import './tasks/clean';
import './tasks/browsersync';
import './tasks/html';
import './tasks/img';
import './tasks/css';
import './tasks/docs';
import './tasks/fonts';
import './tasks/js';
import './tasks/upload';
import './tasks/githooks';
import './tasks/zip';
import './tasks/get-data';

gulp.task('dev', cb => runSequence(
    'clean',
    ['docs', 'html', 'copy-components', 'copy-components-data', 'img', 'fonts'],
    ['css', 'js', 'browsersync', 'docs-watch', 'html-watch', 'copy-components-watch', 'copy-components-data-watch', 'img-watch', 'css-watch', 'fonts-watch'],
    cb
));

gulp.task('dist', cb => runSequence(
    'clean',
    'img',
    ['docs', 'html', 'copy-components', 'copy-components-data', 'css', 'fonts', 'js'],
    'zip',
    cb
));

gulp.task('lint', cb => runSequence(
    'css-lint',
    'js-lint',
    cb
));

gulp.task('test', [
    'js-test'
]);

gulp.task('upload', cb => runSequence(
    'dist',
    'file-upload',
    cb
));

gulp.task('go-go-get-data', cb => runSequence(
    cb
));
