'use-strict';

import observer from '../../../static/js/utils/Observer';
import store from '../../../static/js/lib/store';

const nunjucks = require('nunjucks');
const nunjucksConfig = {
    atom: '00_atom',
    molecule: '01_molecule',
    organism: '02_organism'
};

/**
 * @param {*} env
 * @param {*} name
 */
function createNunjucksExtention(env, name) {
    this.tags = [name];

    this.parse = (parser, nodes) => {
        const token = parser.nextToken();
        const args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        return new nodes.CallExtension(this, 'run', args);
    };

    this.run = (context, url, body, errorBody) => {

        const path = `../components/${nunjucksConfig[name]}/${url}/${url}.njk`;
        const data = {
            data: context.ctx
        };

        return new nunjucks.runtime.SafeString(env.render(path, data));
    };
}

class ArticleList {

    constructor(element, options) {
        this.options = options;
        this.element = element;
        this.nunjucks = nunjucks;
        this.env = this.configureNunjucksEnv();

        this.configure();
        this.getData();
        this.watch();
    }

    configure() {
        this.renderName = this.options.renderName;
        this.renderType = this.options.renderType;
        this.renderContainingElement = this.options.renderContainingElement;
        this.renderClass = this.options.renderClass;
        this.renderId = this.options.renderClass;
        this.dataUrl = this.options.dataUrl;
    }

    getData() {
        fetch(this.dataUrl)
            .then(res => res.json())
            .then(res => this.render(this.options, res))
            .catch(err => console.log('err: ', err));
    }

    configureNunjucksEnv() {
        const env = new this.nunjucks.Environment();

        env.addExtension('atom', new createNunjucksExtention(env, 'atom'));
        env.addExtension('molecule', new createNunjucksExtention(env, 'molecule'));
        env.addExtension('organism', new createNunjucksExtention(env, 'organism'));

        return env;
    }

    render(options, allArticlesData) {
        const template = `../components/${nunjucksConfig[options.renderType]}/${options.renderName}/${options.renderName}.njk`;


        const allArticlesAsHtml = allArticlesData
            .sort((oldArticleData, newArticleData) => new Date(newArticleData.dateAdded) - new Date(oldArticleData.dateAdded))
            .reduce((reducedArticlesAsHtml, newArticleData) => {
                let newArticleAsHtml = '';
                if (this.renderContainingElement) {
                    const customClass = this.renderClass ? `class="${this.renderClass}"` : '';
                    const customId = this.renderClass ? `id="${this.renderClass}"` : '';

                    newArticleAsHtml = `
                        <${this.renderContainingElement} ${customClass} ${customId}>
                            ${this.env.render(template, newArticleData)}
                        </${this.renderContainingElement}>
                    `;
                } else {
                    newArticleAsHtml = `${this.env.render(template, newArticleData)}`;
                }

                return reducedArticlesAsHtml += newArticleAsHtml;
            }, '');

        this.element.innerHTML = allArticlesAsHtml;
    }

    watch() {
        observer.subscribe(store, 'update-article-list', () => this.update());
    }

    update() {
        const articlesData = store.get('articles');
        this.render(this.options, articlesData);
    }

}

export default ArticleList;
