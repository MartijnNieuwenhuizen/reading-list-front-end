const nunjucks = require('nunjucks');

class AtomicBasedNunjucksFactory {
    constructor() {
        console.log(';heloooooooo;;;;;;')
    }
}

export default () => new AtomicBasedNunjucksFactory();
