import {App} from '../../core/core.js'
export default {
    modal: function(toolTab, offsetTop, offsetLeft, list){
        return `
            <div
            tool-tab-modal
            class="position-absolute"
            style="top: ${offsetTop}px; left: ${offsetLeft}px; z-index: 1200;">
                <ul
                class="list-group bg-white"
                style="box-shadow: 0 0 1rem 0 rgba(0,0,0,0.15); z-index: 5; min-width: 10rem;">
                    ${list.map((li,idx)=>`<li tool-tab-${toolTab}=${list[idx]} class="list-item py-1 fs-7">${li}</li>`).join('')}
                </ul>
            </div>
        `
    },
    menu: {
        file: {
            import: {

            },
            export: function(){
                console.log(document.querySelector('[tool-window]'))
            }
        },
        tool: {
            line: {

            },
            'change shape': {

            }
        },
        window: {
            'wide screen': {

            }
        },
        about: {
            developer: {

            },
            help: {

            }
        }
    },
    created(){
        window.addEventListener('click', (ev)=>{
            const target = ev.target;
            const toolTab = target.getAttribute('tool-tab');
            const modal = document.querySelector('[tool-tab-modal]');

            modal?.remove();

            if(!toolTab) return;

            const rect = target.getBoundingClientRect();
            const top = rect.top + rect.height;
            const left = rect.left;

            document.body.insertAdjacentHTML('beforeend', this.modal(toolTab, top, left, Object.keys(this.menu[toolTab])));
        });
    },
    list(){
        return Object.keys(this.menu).map(x=>`<li><span tool-tab="${x}" class="text-muted">${x.charAt(0).toUpperCase()+x.slice(1)}</span></li>`).join('');
    },
    template: function() {
        return `
        <nav
        class="gnb position-sticky bg-light us-none gnb-dark"
        style="line-height: 1rem;">
            <div class="gnb-inner gnb-expand-md hide align-items-center">
                <div class="fw-bold fs-5 ps-3 pe-5">
                    <a
                    class="text-success"
                    href="#home">${App.brand}</a>
                </div>
                <div class="menu-btn">
                    <button class="btn btn-light text-gray fs-4" data-target="#gnbMenu" style="line-height: 1">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                <ul
                id="gnbMenu"
                class="gnb-menu w-flex hide fs-7">
                    ${this.list()}
                </ul>
            </div>
        </nav>
        `
    }
}