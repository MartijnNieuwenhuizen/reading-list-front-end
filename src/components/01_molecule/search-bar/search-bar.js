/* eslint-disable func-style, no-return-assign */

'use-strict';

import store from '../../../static/js/lib/store';
import observer from '../../../static/js/utils/Observer';

class SearchBar {

    constructor(element, options) {
        this.element = element;
        this.options = options;

        this.target = document.querySelector(`.${options.target}`);
        this.inputTrigger = element.querySelector(`.${options.inputElement}`);
        this.articlesToSearch = [];

        this.addListeners();
        this.watch();
    }

    addListeners() {
        this.inputTrigger.addEventListener('input', () => this.search());
    }

    watch() {
        observer.subscribe(store, 'update-article-list', () => this.update());
    }

    update() {
        this.articlesToSearch = store.get('articles');
    }

    search() {
        // Implement debounce pattern here!
        // Add smart filtering here: # is only search in tags in following words

        const mapPropertiesToArray = article => {
            article.searchTerms = [article.author, article.link, article.readingTimeInMinutes, article.title, ...article.tags];
            return article;
        };
        const allToLowerCase = value => value.toLowerCase();
        const filterOnSearchTerms = (article, terms) => Boolean(article.searchTerms.filter(value => value.includes(terms)).length);
        const filterOnEmptyItems = item => item;

        const filterValues = this.inputTrigger.value
            .split(' ')
            .filter(filterOnEmptyItems)
            .map(allToLowerCase);

        const filteredArticlesSlugs = this.articlesToSearch
            .map(mapPropertiesToArray)
            .filter(article => filterOnSearchTerms(article, filterValues))
            .map(item => item.slug);

        store.set('search-filtered-articles', filteredArticlesSlugs);
        observer.publish(store, 'search-action');
    }

}

export default SearchBar;
