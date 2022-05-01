'use strict';

import modules from './modules/modules.js'

export default (function () {
    function Controller() {
        let models;
        let active = false;
        let sidebarActive = false;
        let tabInfo;
        let tabOpenPlace;
        let parts;

        this.init = function (model) {
            models = model;

            parts = models.getParts();

            window.addEventListener('click', this.toolTabOpenActive);
            window.addEventListener('mousemove', this.toolTabOpen);

            window.addEventListener('mousedown', this.sidebarResizeActive);
            window.addEventListener('mouseup', this.sidebarResizeInActive);
            window.addEventListener('mousemove', this.sidebarResizeMove);

            window.addEventListener('click', this.selectToolShape);
            // window.addEventListener('click', this.addToSchematics);

            window.addEventListener('click', this.infoValueWritable);
            window.addEventListener('keydown', this.infoValueHandler);
            window.addEventListener('change', this.infoValueChange);
            window.addEventListener('click', this.infoValueApply);
            window.addEventListener('click', this.changeDivInput);
            window.addEventListener('click', this.addContents);
        }

        this.addContents = function (ev){
            const target = ev.target;
            if(!target.hasAttribute('add-contents'))return;
            const btn = document.querySelector('[add-contents]');
            
            models.addContents(target, btn);
        }

        this.changeDivInput = function (ev){
            const target = ev.target;
            if(!target.hasAttribute('work-id'))return;
        }

        this.infoValueApply = function (ev) {
            const target = ev.target;
            const apply = target.hasAttribute('info-apply');
            if (!apply) return;

            models.infoValueApply(target);
        }

        this.infoValueHandler = function (ev) {
            const target = ev.target;
            const info = target.hasAttribute('info');
            if (!info) return;
            models.infoValueHandler(target, ev);
        }

        this.infoValueChange = function (ev) {
            const target = ev.target;
            const info = target.hasAttribute('info');
            if (!info) return;
            models.infoValueChange(target, ev);
        }

        this.infoValueWritable = function (ev) {
            const target = ev.target;
            const info = target.getAttribute('info');

            document.querySelectorAll('[info]').forEach(el => {
                if (el != target) {
                    el.disabled = true;
                }
            });

            if (!info && !target.disabled) {
                return;
            }

            target.removeAttribute('disabled');
            target.focus();
        }

        // this.addToSchematics = function (ev){
        //     const target = ev.target;
        //     const addWork = target.getAttribute('add-work');
        //     if(!addWork) return;

        //     models.addToSchematics(target, addWork);
        // }

        this.selectToolShape = function (ev) {
            const target = ev.target;
            const shape = target.getAttribute('tool-shape');
            if (!shape) return;
            models.selectToolShape(target, shape);
        }

        this.sidebarResizeActive = function (ev) {
            const target = ev.target;
            if (!target.classList.contains('middle')) return;

            sidebarActive = true;
        }

        this.sidebarResizeInActive = function (ev) {
            sidebarActive = false;
        }

        this.sidebarResizeMove = function (ev) {
            const sidebar = document.querySelector('aside.sidebar');
            if (sidebarActive) {
                sidebar.style.flex = `0 0 ${window.innerWidth - ev.clientX}px`;
            }
        }

        this.toolTabOpenActive = function (ev) {
            const target = ev.target;
            const type = target.getAttribute('tool-tab');
            tabOpenPlace = target;
            if (!target.hasAttribute('tool-tab')) {
                active = false;
                models.clearOpenedTab();
                return;
            }

            active = true;
            models.toolTabOpen(tabOpenPlace, type);
        }

        this.toolTabOpen = function (ev) {
            const target = ev.target;
            const isList = target.closest('[tab-list]');
            const isTab = target.hasAttribute('tool-tab');
            const before = tabOpenPlace;

            if (!isList && !isTab || !active) {
                active = false;
                models.clearOpenedTab();
                return;
            }

            if (isTab) {
                tabOpenPlace = target;
                tabInfo = target.getAttribute('tool-tab');
            }

            if (before != tabOpenPlace) models.toolTabOpen(tabOpenPlace, tabInfo);
        }
    }

    function Model() {
        let views;
        let parts;
        let initVal;
        let schematics = [];
        let currentWork = null;
        let mode = null;
        let beforeVal;

        this.init = function (view) {
            views = view;

            parts = views.getParts();
            initVal = parts.options.initialValue;
        }

        this.getParts = function(){
            return views.getParts();
        }

        this.addContents = function (target, btn){
            btn.insertAdjacentHTML('beforebegin', parts.modules.info.elInput('contents', currentWork.info));
        }

        this.infoValueHandler = function (input, ev) {
            const infoName = input.getAttribute('info');
            const infoValue = input.value;
            if (!beforeVal) beforeVal = infoValue;
            const isNum = infoValue.match(/[\-\d]+/gm);
            let nums = 0;
            let unit = '';
            if (isNum) {
                [nums, unit] = infoValue.split(isNum[0]);
                nums = parseInt(nums + isNum[0]);
                unit = infoValue.split(isNum[0]).pop();
            }

            if (ev.key == 'ArrowUp') {
                nums++;
                if (nums < 0) nums = 0;
                input.value = nums + unit;
            } else if (ev.key == 'ArrowDown') {
                nums--;
                if (nums < 0) nums = 0;
                input.value = nums + unit;
            } else if (ev.key == 'Enter') {
                document.querySelectorAll('input[info]').forEach(el => el.disabled = true);
            } else if (ev.key == 'Escape') {
                input.value = beforeVal;
                beforeVal = null;
                document.querySelectorAll('input[info]').forEach(el => el.disabled = true);
            }
        }

        this.infoValueChange = function (input, ev) {
            const info = input.getAttribute('info');
            
            if(info=='contents'){
                document.querySelectorAll(`[info="${info}"]`).forEach(el=>{
                    const idx = [...el.parentNode.children].slice(1).indexOf(el);
                    const infoValue = el.value;

                    if(idx==-1) currentWork.info['contents'].push(infoValue);
                    else currentWork.info['contents'][idx] = infoValue;
                });
            } else {
                const infoName = input.getAttribute('info');
                const infoValue = input.value;
    
                if (infoName != 'border') {
                    currentWork.info[infoName] = infoValue;
                } else {
                    let [width, type, color] = infoValue.split(' ');
                    currentWork.info[infoName].width = width;
                    currentWork.info[infoName].type = type;
                    currentWork.info[infoName].color = color;
                }
            }
            console.log(currentWork, schematics)
        }

        this.infoValueApply = function () {
            this.addToSchematics();
            currentWork = null;
            this.renderView();
        }

        this.addToSchematics = function () {
            let idx = -1;
            if (currentWork) {
                for (let sch of schematics) {
                    if (sch.id == currentWork.id) {
                        idx = schematics.indexOf(sch);
                        break;
                    }
                }
                if (idx == -1) {
                    schematics.push(currentWork);
                } else {
                    schematics[idx] = currentWork;
                }
            }
            console.log('done');
        }

        this.selectToolShape = function (target, shape) {
            currentWork = this.createWork(shape);
            this.renderView();
        }

        this.toolTabOpen = function (target, type) {
            const rect = target.getBoundingClientRect();

            views.clearOpenedTab();
            views.toolTabOpen(target, type, rect);
        }

        this.clearOpenedTab = function () {
            views.clearOpenedTab();
        }

        this.createWork = function (shape) {
            initVal.shape = shape;
            return {
                id: new Date().getTime().toString(36),
                info: initVal,
            }
        }

        this.renderView = function () {
            views.renderView(schematics, currentWork);
        }
    }

    function View() {
        let parts;
        let app;
        let nav;
        let sidebar;
        let footer;

        this.init = function (part) {
            parts = part;

            app = document.querySelector(parts.options.el);
            nav = document.querySelector('#gnb');
            footer = document.querySelector('footer');

            this.renderSubParts();
            sidebar = document.querySelector('.sidebar');
        }

        this.getParts = function () {
            return parts;
        }

        this.toolTabOpen = function (target, type, rect) {
            const top = rect.top + rect.height;
            const left = rect.left;

            parts.modules.tabList.render(nav, {
                type,
                top,
                left
            });
        }

        this.renderSubParts = function () {
            parts.modules.gnb.render(nav);
            parts.modules.footer.render(footer);
        }

        this.renderView = function (list, work) {
            this.clearSidebar();
            this.clearGround();
            this.renderGroung(list);
            console.log(list, work)
            if (work) this.renderInfo(sidebar, work.info);
        }

        this.renderGroung = function (list) {
            parts.modules.ground.render(app, list);
        }

        this.renderInfo = function (el, info) {
            parts.modules.info.render(el, info);
        }

        this.clearGround = function () {
            app.innerHTML = '';
        }

        this.clearSidebar = function () {
            sidebar.innerHTML = '';
        }

        this.clearOpenedTab = function () {
            const tabLists = document.querySelectorAll('[tab-list]');
            tabLists.forEach(x => x.remove());
        }
    }

    return {
        init(options) {
            const parts = {
                modules,
                options: this.initialize(options),
            }

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(parts);
            model.init(view);
            controller.init(model);
        },
        initialize(options) {
            return Object.assign({}, {
                el: '#app',
                menu: [
                    'file',
                    'window',
                    'about',
                ],
                initialValue: {
                    top: '3px',
                    left: '3px',
                    shape: 'box',
                    width: '150px',
                    height: '150px',
                    bgColor: 'white',
                    color: 'black',
                    opacity: 1,
                    border: {
                        use: true,
                        width: '1px',
                        type: 'solid',
                        color: 'black',
                    },
                    align: 'all', // horizon, vertical
                    contents: [],
                },
            }, options);
        }
    }
})();