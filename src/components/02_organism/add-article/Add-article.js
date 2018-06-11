import observer from '../../../static/js/utils/Observer';
import store from '../../../static/js/lib/store';

/**
 * @param {object} data - all values from the form
 * @returns {object}
 */
function createPostOptions(data) {
    return {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: new Headers({
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        })
    };
}

class AddArticle {

    constructor(element, options) {
        this.element = element;
        this.userInputs = Array.from(this.element.querySelectorAll('input, textarea'));
        this.options = options;

        this.addEventListeners();
    }

    addEventListeners() {
        this.element.addEventListener('submit', event => this.handlePostAction(event), false);
    }

    handlePostAction(event) {
        const values = this.userInputs.reduce((acc, obj) => {
            acc[obj.name] = obj.value;
            return acc;
        }, {});

        const options = createPostOptions(values);
        fetch(this.element.action, options)
            .then(res => res.json())
            .then(data => {
                store.set('articles', data);
                observer.publish(store, 'update-article-list');
            })
            .catch(error => console.error('catch: ', error));

        event.preventDefault();
    }
}

export default AddArticle;
