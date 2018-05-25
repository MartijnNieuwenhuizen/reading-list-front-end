'use-strict';

const nunjuckssssss = require('nunjucks');

/**
 * @returns {object} new instance of Nunjucks
 */
function createNunjucks() {
    const nunjucks = require('nunjucks');
    return nunjucks;
}



/**
 * @param {string} err
 * @param {string} res
 */
function cb (err, res) {
    if (err) {
        console.log('err: ', err);
    } else {
        console.log('res: ', res);
        console.log('done rendering');
    }
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
    console.log('name: ', name);
    this.tags = [name];

    this.parse = (parser, nodes, lexer) => {
        const tok = parser.nextToken();

        const args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        const body = parser.parseUntilBlocks('error', 'endremote');

        let errorBody = null;
        if (parser.skipSymbol('error')) {
            parser.skip(lexer.TOKEN_BLOCK_END);
            errorBody = parser.parseUntilBlocks('endremote');
        }
        // parser.advanceAfterBlockEnd();

        return new nodes.CallExtension(this, 'run', args, [body, errorBody]);
    };

    this.run = (context, url, body, errorBody) => {

        console.log('context', context);
        console.log('url', url);
        console.log('body', body);
        console.log('errorBody', errorBody);

        const path = `../components/${nunjucksConfig[name]}/${url}/${url}.njk`;
        console.log('path: ', path);

        var id = 'el' + Math.floor(Math.random() * 10000);
        const blaaaaa = new nunjuckssssss.runtime.SafeString('<div id="' + id + '">' + body() + '</div>');
        const blaaaaatttt = new nunjuckssssss.runtime.SafeString(env.render(path, context.ctx, cb));
        console.log('blaaaaa: ', blaaaaa);
        // console.log('blaaaaatttt: ', blaaaaatttt);
        return blaaaaa;
    };
}


class ArticleList {

    constructor(element, options) {
        this.listItemName = options.listItemName;
        this.listItemType = options.listItemType;
        this.nunjucks = createNunjucks();
        this.env = this.configureNunjucksEnv();

        this.render();
    }

    configureNunjucksEnv() {
        const env = new this.nunjucks.Environment();

        env.addExtension('atom', new createExtension(env, 'atom'));
        env.addExtension('molecule', new createExtension(env, 'molecule'));
        env.addExtension('organism', new createExtension(env, 'organism'));
        console.log('env: ', env);

        return env;
    }

    render() {
        const itemName = '../components/01_molecule/article-preview/article-preview.njk';
        const data = {
            title: 'No Need to Come to the Office: Making Remote Work at GitLab',
            link: 'https://hackernoon.com/no-need-to-come-to-the-office-making-remote-work-at-gitlab-737c42865210',
            author: 'Jurriaan Kamer',
            readingTimeInMinutes: '?',
            tags: ['Remote', 'working', 'organization'],
            ctaText: 'Lezen',
            dateAddedTitle: '2018-05-19',
            dateAdded: '2018-05-19T15:33:25.898Z',
            addedBy: 'Martijn Nieuwenhuizen',
            addedBySlug: 'Martijn-Nieuwenhuizen'
        };

        const blaaaaa = this.env.render(itemName, data, cb);
        console.log('blaaaaa: ', blaaaaa);
    }

}

export default ArticleList;
