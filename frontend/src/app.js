import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router();

        window.addEventListener('DOMContentLoaded', this.handleRoutChanging.bind(this));
        window.addEventListener('popstate', this.handleRoutChanging.bind(this));
    }

    handleRoutChanging() {
        this.router.openRoute();
    }
}

(new App());