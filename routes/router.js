'use strict';

import {Router, Layout} from '../core/core.js'

import Home from '../views/pages/home.js'

import nav from '../views/commons/nav.js'
import side from '../views/commons/side.js'
import footer from '../views/commons/footer.js'

Router.setPage('home', Home);

Router.setModulePage('nav', nav);
Router.setModulePage('side', side);
Router.setModulePage('footer', footer);

Layout.module = {
    nav, footer
}

Layout.template(`
    {{nav}}
    <div class="main">
        <main>
            <section class="h-100">
                {{page}}
            </section>
        </main>
        {{side}}
    </div>
    {{footer}}
`);

export default {
    ...Router
}