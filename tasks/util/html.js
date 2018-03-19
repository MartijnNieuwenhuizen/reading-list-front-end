import { html as config } from '../../config';
import fs from 'fs';
import { nunjucks } from 'gulp-nunjucks-render';

/**
 * @param {Vinyl} file
 * @returns {{}} viewModel object
 */
export function getViewModel(file) {

    // Load viewModel file if available on disk
    const viewModelFile = file.path.replace('.njk', '-data.json');
    const viewModel = fileExists(viewModelFile) ? requireNoCache(viewModelFile) : {};

    // Load content file if available on disk
    const contentFile = file.path.replace('.njk', '-content.json');
    const content = fileExists(contentFile) ? requireNoCache(contentFile) : {};

    return decorateViewFunctions({
        baseUri: config.baseUri.templates,
        viewModel,
        content
    });
}

/**
 * @param {string} file
 * @returns {boolean}
 */
export function fileExists(file) {
    try {
        return fs.statSync(file).isFile();
    } catch (e) {}
    return false;
}

/**
 * @param {string} pathSpec
 */
export function requireNoCache(pathSpec) {
    delete require.cache[require.resolve(pathSpec)];
    return require(pathSpec);
}

/**
 * Define view util functions
 * @param {Object} obj
 * @returns {{ include: Function, json: Function, merge: Function }}
 */
export function decorateViewFunctions(obj) {
    const viewFunctions = {
        include: (file, viewModel) =>
            nunjucks.render(`${config.src.componentsDir}/${file}`, decorateViewFunctions(viewModel)),
        json: file => requireNoCache(`${config.src.componentsDir}/${file}`),
        merge: (...objects) => mergeObjectsDeep({}, ...objects)
    };
    return Object.assign(obj, viewFunctions);
}

/**
 * Recursive deep object merge
 * @param {Object} target
 * @param {Object} sources
 * @returns {Object}
 */
export function mergeObjectsDeep(target, ...sources) {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        for (const prop in source) {
            if (!source.hasOwnProperty(prop)) continue;
            if (source[prop].constructor === Object) {
                target[prop] = mergeObjectsDeep({}, target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
    }
    return target;
}
