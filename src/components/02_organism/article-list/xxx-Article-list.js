class ArticleList {

    constructor(element, options) {
        // this.elements = Array.from(element.querySelectorAll('.article-list__item'));
        // this.hideClass = 'article-list__item--hide';
        // this.intersectionObserver = new IntersectionObserver(entries => this.setupInteractionObserverBehavior(entries));

        // this.onLoad(); // Style items accordingly
        // this.addListeners();

        // const thresholds = this.intersectionObserver.thresholds;
        // console.log('thresholds: ', thresholds);

        this.fetchDataFromServer('http://localhost:8080/');
    }

    fetchDataFromServer(url) {
        fetch(url)
            .then(res => console.log('res: ', res.body))
            .catch(err => console.log(new Error(err)));
    }

    onLoad() {
        this.elements.forEach(element => element.classList.add(this.hideClass));
    }
    addListeners() {
        this.elements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }
    setupInteractionObserverBehavior(entries) {
        if (entries[0].intersectionRatio <= 0) return;
        console.log('entries[0].intersectionRatio: ', entries[0].intersectionRatio);
        console.log('entries[0]: ', entries[0]);

        // If in middle of the screen
        console.log('entries[0]: ', entries[0]);
        this.inView(entries[0].target);
    }

    inView(element) {
        element.classList.remove(this.hideClass);
        this.intersectionObserver.unobserve(element);
    }

}

export default ArticleList;
