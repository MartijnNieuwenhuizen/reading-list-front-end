const DOMHelpers = {

    query(selector, element = document) {
        return element.querySelector(selector);
    },

    queryAll(selector, element = document) {
        return Array.from(element.querySelectorAll(selector));
    },

    /**
     * DOM ready implementation
     * @returns {Promise}
     */
    ready() {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            return Promise.resolve();
        }
        return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    },

    reflow(element) {
        return element.offsetHeight;
    },

    setPrefixedStyle(element, property, value) {
        const prefixes = ['', '-webkit-', '-moz-', '-ms-'];
        prefixes.forEach(prefix => {
            element.style[prefix + property] = value;
        });
    }

};

export default DOMHelpers;
