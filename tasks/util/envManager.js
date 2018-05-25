import includeData from 'nunjucks-includeData'
import { ComponentTag } from './nunjucks-extensions'

module.exports = env => {
    // IncludeData plugin
    includeData.install(env);

    // Extensions
    env.addExtension('component', new ComponentTag(env, 'component'));
    env.addExtension('atom', new ComponentTag(env, 'atom'));
    env.addExtension('moleculeeeeee', new ComponentTag(env, 'molecule'));
    env.addExtension('organism', new ComponentTag(env, 'organism'));

    // Filters
    env.addFilter('isNumber', input => typeof input === 'number');
};
