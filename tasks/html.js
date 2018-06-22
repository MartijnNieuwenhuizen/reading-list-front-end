import { html as config } from '../config';
import { reload } from 'browser-sync';
import gulp from 'gulp';
import render from 'gulp-nunjucks-render';
import watch from 'gulp-watch';
import envManager from './util/envManager';
import data from 'gulp-data';
import fs, { read } from 'fs';
import { writeFileSync as writeFile } from 'fs';
import { readFileSync as readFile } from 'fs';
import { swallowError } from '../tasks/util/generic';

import { sync as glob } from 'glob';
import { execSync as exec } from 'child_process';

// If a template has a .json file with the same name in the same location, load it as a data source
const getDataForFile = file => {
    try {
        return JSON.parse(readFile(file.path.replace('.njk', '.json')));
    } catch (error) {
        return {};
    }
};

/**
 * Task: HTML Compile
 */
gulp.task('html', () => {
    return gulp.src(config.src.templates)
        .pipe(data(getDataForFile))
        .on('error', swallowError)
        .pipe(render({
            path: [
                config.src.templatesDir,
                config.src.layoutDir,
                config.src.componentsDir
            ],
            manageEnv: envManager
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(config.dist.base))
        .on('end', reload);
});

gulp.task('copy-components', () => {
    return gulp.src(config.src.componentCopy)
        .pipe(gulp.dest(config.dist.componentsDist))
        .on('end', reload);
});

gulp.task('copy-components-watch', () => {
    const paths = config.src;
    watch(paths.components, () => gulp.start(['copy-components'], cb));
});

gulp.task('copy-components-data', () => {

    const finalData = glob(config.src.componentDataCopy)
    .map(filePath => {
        const fileName = filePath.replace(/^.*[\\\/]/, '');
        const keyName = fileName.substring(0, fileName.indexOf('.json'));

        return { filePath, keyName };
    })
    .reduce((buildingData, componentOptions) => {
        const componentData = JSON.parse(readFile(componentOptions.filePath));
        const componentKeyName = componentOptions.keyName;

        Object.assign(buildingData, { [componentKeyName]: componentData });
        return buildingData;
    }, {});

    const filename = 'allData.json';
    writeFile(filename, JSON.stringify(finalData));

    return gulp
        .src('./allData.json')
        .pipe(gulp.dest(config.dist.componentDataCopyDir));


    process.stdout.write(`Created file: ${filename}`);

});

gulp.task('copy-components-data-watch', () => {
    const paths = config.src;
    watch(paths.components, () => gulp.start(['copy-components-data'], cb));
});

/**
 * Task: HTML Watch
 */
gulp.task('html-watch', cb => {
    const paths = config.src;
    watch([
        paths.templates,
        paths.templatesData,
        paths.layout,
        paths.components,
        paths.componentsData
    ], () => gulp.start(['html'], cb));
});
