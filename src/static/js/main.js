// Reference our components so they get included
import { initializeComponents } from 'utils/initializeComponents';

/**
 * @returns {promise}
*/
function ready() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        return Promise.resolve();
    }

    return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
}

ready().then(initializeComponents(document));
