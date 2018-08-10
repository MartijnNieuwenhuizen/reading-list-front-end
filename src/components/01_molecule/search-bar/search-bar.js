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

        const getSlug = item => item.slug;
        const valueToLowerCase = value => value.toLowerCase();
        const mapPropertiesToArray = article => {
            article.searchTerms = [...article.author.split(' '), article.link, article.readingTimeInMinutes, ...article.title.split(' '), ...article.tags];
            console.log('article.searchTerms: ', article.searchTerms);
            return article;
        };
        const allSearchTermsToLowerCase = article => {
            article.searchTerms = article.searchTerms.map(valueToLowerCase);
            return article;
        };
        const filterOnSearchTerms = (article, terms) => Boolean(article.searchTerms.filter(value => value.includes(terms)).length);
        // const filterOnSearchTerms = (article, terms) => Boolean(article.searchTerms.filter(value => terms.filter(term => value.includes(term).length)).length);
        const filterOnEmptyItems = item => item;

        const filterValues = this.inputTrigger.value
            .split(' ')
            .filter(filterOnEmptyItems)
            .map(valueToLowerCase);

        const filteredArticlesSlugs = this.articlesToSearch
            .map(mapPropertiesToArray)
            .map(allSearchTermsToLowerCase)
            .filter(article => filterOnSearchTerms(article, filterValues))
            .map(getSlug);

        store.set('search-filtered-articles', filteredArticlesSlugs);
        observer.publish(store, 'search-action');
    }

}



// const arrayOne = ['this', 'is', 'th'];
// const arrayTwo = ['this is the future', 'welcome to the future'];

// const blaaaat = arrayTwo.some(item => arrayOne.includes(item));
// console.log('blaaaat: ', blaaaat);


export default SearchBar;
