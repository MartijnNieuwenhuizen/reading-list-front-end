'use-strict';

class Store {

    constructor() {
        this.store = new Map();
    }

    set(key, value) {
        this.store.set(key, value);
    }

    get(key) {
        if (this.store.has(key)) {
            return this.store.get(key);
        }
        return null;
    }
}


export default new Store();
