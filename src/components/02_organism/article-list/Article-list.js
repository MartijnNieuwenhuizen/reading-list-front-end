'use-strict';

const nunjuckssssss = require('nunjucks');

/**
 * @returns {object} new instance of Nunjucks
 */
function createNunjucks() {
    const nunjucks = require('nunjucks');
    return nunjucks;
}

const nunjucksConfig = {
    atom: '00_atom',
    molecule: '01_molecule',
    organism: '02_organism'
};

/**
 * @param {object} env
 * @param {string} name
 */
function createExtension(env, name) {
    this.tags = [name];

    this.parse = (parser, nodes, lexer) => {
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
        return new nunjuckssssss.runtime.SafeString(env.render(path, data));
    };
}

class ArticleList {

    constructor(element, options) {
        this.renderName = options.renderName;
        this.renderType = options.renderType;
        this.renderContainingElement = options.renderContainingElement;
        this.renderClass = options.renderClass;
        this.renderId = options.renderClass;
        this.dataUrl = options.dataUrl;
        this.nunjucks = createNunjucks();
        this.env = this.configureNunjucksEnv();
        this.element = element;

        fetch(this.allContentDataURl)
        .then(res => res.json())
            .then(res => console.log('res: ', res))
            .catch(err => console.log('err: ', err));

        fetch(this.dataUrl)
            .then(res => res.json())
            .then(res => this.render(options, res))
            .catch(err => console.log('err: ', err));

    }

    configureNunjucksEnv() {
        const env = new this.nunjucks.Environment();

        env.addExtension('atom', new createExtension(env, 'atom'));
        env.addExtension('molecule', new createExtension(env, 'molecule'));
        env.addExtension('organism', new createExtension(env, 'organism'));

        return env;
    }

    render(options, allArticlesData) {
        const template = `../components/${nunjucksConfig[options.renderType]}/${options.renderName}/${options.renderName}.njk`;

        const allArticlesAsHtml = allArticlesData.reduce((reducedArticlesAsHtml, newArticleData) => {
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

}

export default ArticleList;
