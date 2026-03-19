import 'bootstrap-icons/font/bootstrap-icons.css';
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.css';
import './styles/styles.scss';
import {Router} from "./router.js";

class Main {
    constructor () {
        new Router();
    }
}

(new Main());
