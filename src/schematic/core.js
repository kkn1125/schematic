import {
    info,
    module
} from './parts.js'

export default (function () {
    function Controller() {
        let models;

        this.init = function (model) {
            models = model;
            /** tabs */
            window.addEventListener('click', this.tabSelect);
            window.addEventListener('mouseover', this.tabOver);
            /** tabs */
            window.addEventListener('click', this.selectShape);

            /** input convert */
            window.addEventListener('change', this.sendValue);
            window.addEventListener('keydown', this.changeValue);
            window.addEventListener('click', this.removeEmptyContent);
            document.querySelector('#app').addEventListener('mousedown', this.mouseSetActive);
            window.addEventListener('mouseup', this.mouseSetInActive);
            document.querySelector('#app').addEventListener('mousemove', this.mouseSetValue);
            /** input convert */
            
            /** handle work */
            window.addEventListener('click', this.toolCheck);
            window.addEventListener('click', this.selectWork);
            window.addEventListener('click', this.addContent);
            window.addEventListener('click', this.removeSchema);
            /** handle work */
            
            /** handle side */
            window.addEventListener('mousedown', this.sidebarActivate);
            window.addEventListener('mousemove', this.sidebarHandler);
            window.addEventListener('mouseup', this.sidebarInActivate);
        }

        this.removeSchema = function (ev){
            const schema = ev.target;
            if(!schema.hasAttribute('remove-schema')) return;

            models.removeSchema(schema);
        }

        this.mouseSetActive = function (ev){
            const work = ev.target;
            if(!work.hasAttribute('schematic-id')) return;
            models.mouseSetActive(ev, work);
        }

        this.mouseSetValue = function (ev){
            models.mouseSetValue(ev, this);
        }

        this.mouseSetInActive = function (ev){
            models.mouseSetInActive();
        }

        this.sidebarHandler = function (ev){
            models.sidebarHandler(ev, document.querySelector('.sidebar'));
        }

        this.sidebarActivate = function (ev){
            const middle = ev.target;
            if(!middle.classList.contains('middle')) return;

            models.sidebarActivate();
        }

        this.sidebarInActivate = function (ev){
            models.sidebarInActivate();
        }

        this.addContent = function (ev){
            const btn = ev.target;

            if(!btn.hasAttribute('add-content')) return;

            const select = document.querySelector('[work-id]');

            models.addContent(select);
        }

        this.removeEmptyContent = function (ev){
            const btn = ev.target;

            if(!btn.hasAttribute('remove-content')) return;

            models.removeEmptyContent(btn);
        }

        this.toolCheck = function (ev){
            const check = ev.target;
            if(!check.hasAttribute('tool-check')) return;

            models.toolCheck(check);
        }

        this.sendValue = function (ev){
            const input = ev.target;
            if(!input.hasAttribute('work-value')) return;

            models.sendValue(input);
        }

        this.changeValue = function (ev){
            const input = ev.target;
            if(!input.hasAttribute('work-value')) return;
            models.changeValue(ev, input);
        }

        this.selectWork = function (ev){
            const work = ev.target;

            if(!work.hasAttribute('schematic-id')) return;

            models.selectWork(work);
        }

        this.tabSelect = function (ev){
            const tab = ev.target;

            if(!tab.hasAttribute('tool-tab')) {
                models.tabOpenInActivate();
                models.tabClose();
                return;
            }

            models.tabOpenActivate(tab);
        }

        this.tabOver = function (ev){
            const tab = ev.target;

            if(!tab.hasAttribute('tool-tab')) {
                if(!tab.closest('[open-tool-tab]')){
                    models.tabClose(tab.closest('[open-tool-tab]'));
                    models.tabOpenInActivate();
                }
                return;
            }

            models.tabOver(tab);
        }

        this.selectShape = function (ev) {
            const shape = ev.target;

            if (!shape.hasAttribute('tool-shape')) return;

            models.selectShape(shape);
        }

    }

    function Model() {
        let schematics = {};
        let current;
        let views;
        let parts;
        let clickTab = false;
        let sideClick = false;
        let mouseMode = false;
        let clickedTop = 0;
        let clickedLeft = 0;

        this.init = function (view) {
            views = view;
            parts = this.getParts();
            this.getStorage();
            this.renderView();
        }

        this.getParts = function () {
            return views.getParts();
        }

        this.removeSchema = function (schema){
            const id = schema.parentNode.parentNode.getAttribute('work-id');
            delete schematics[id];
            current = null;
            this.renderView();
        }

        this.mouseSetValue = function (ev){
            if(mouseMode){
                let work = document.querySelector(`[schematic-id="${current.id}"]`);
                current.info.top = ev.clientY-clickedTop*1.2+'px';
                current.info.left = ev.clientX-clickedLeft+'px';
                this.renderView();
            }
        }

        this.mouseSetActive = function (ev, work){
            mouseMode = true;
            clickedTop = ev.offsetY;
            clickedLeft = ev.offsetX;
            current = {
                id: work.getAttribute('schematic-id'),
                shape: work.getAttribute('schematic-shape'),
                info: schematics[work.getAttribute('schematic-id')].info,
            }
        }

        this.mouseSetInActive = function (work){
            mouseMode = false;
            clickedTop = 0;
            clickedLeft = 0;
        }

        this.sidebarHandler = function (ev, side){
            if(sideClick){
                side.style.flex = `0 0 ${window.innerWidth - ev.clientX - 16*3}px`;
            }
        }

        this.sidebarActivate = function (){
            sideClick = true;
        }

        this.sidebarInActivate = function (){
            sideClick = false;
        }

        this.addContent = function (select){
            const id = select.getAttribute('work-id');
            current.info.contents.push('');

            this.renderView();
        }

        this.removeEmptyContent = function (btn){
            current.info.contents = current.info.contents.filter(content=>content!=='');
            console.log(current.info.contents)
            this.renderView();
        }

        this.selectWork = function (work){
            const id = work.getAttribute('schematic-id');
            current = {
                id: id,
                shape: schematics[id].shape,
                info: schematics[id].info,
            };
            this.renderView();
        }

        this.toolCheck = function (check){
            schematics[current.id] = {
                shape: current.shape,
                info: current.info,
            }
            current = null;

            this.renderView();
        }

        this.sendValue = function (input){
            const work = document.querySelector('[work-id]');
            const id = work.getAttribute('[work-id]');
            const name = input.getAttribute('work-value');
            const value = input.value;

            if(name == 'contents') {
                let idx = [...input.parentNode.children].indexOf(input);
                if(current.info[name].length==0) current.info[name].push(value);
                else current.info[name][idx] = value;
            } else current.info[name] = value;

            input.removeAttribute('save');
        }

        this.changeValue = function (ev, input){
            const work = document.querySelector('[work-id]');
            const id = work.getAttribute('[work-id]');
            const name = input.getAttribute('work-value');
            let value = input.value;
            let removeEmpty = false;

            if(!input.hasAttribute('save')) input.setAttribute('save', input.value);
            
            if(ev.key == 'ArrowUp'){
                value = value.replace(/\-*[\d]*\.*[\d]+/gm, (t, i , o)=>{
                    let num = parseFloat((parseFloat(t) + 5).toFixed(2));
                    return num;
                })
            } else if(ev.key == 'ArrowDown'){
                value = value.replace(/\-*[\d]*\.*[\d]+/gm, (t, i , o)=>{
                    let num = parseFloat((parseFloat(t) - 5).toFixed(2));
                    return num;
                })
            } else if(ev.key == 'Escape'){
                value = input.getAttribute('save');
            } else if(ev.key == 'Enter'){
                input.removeAttribute('save');
                input.blur();
                return;
            }

            input.value = value;
            
            if(name == 'contents') {
                let idx = [...input.parentNode?.children].indexOf(input);
                if(current.info[name].length==0) current.info[name].push(value);
                else current.info[name][idx] = value;
            } else current.info[name] = value;

            if(removeEmpty) {
                document.querySelectorAll('[work-value="contents"]').forEach(el=>{
                    if(el.value.trim() == '') el.remove();
                })
                removeEmpty = false;
            }
        }

        this.tabOpenActivate = function (tab){
            clickTab = !clickTab;

            if(clickTab) this.tabOpen(tab);

            else this.tabClose(tab);
        }

        this.tabOpenInActivate = function (tab){
            clickTab = false;
        }

        this.tabOver = function (tab){
            this.tabClose(tab);

            if(clickTab){
                this.tabOpen(tab);
            }
        }

        this.tabOpen = function (tab){
            const {top, height, left} = tab.getBoundingClientRect();
            const type = tab.getAttribute('tool-tab');

            parts.module.topbar.render(type, top+height, left);
        }

        this.tabClose = function (tab){
            document.querySelectorAll('[open-tool-tab]').forEach(el=>el.remove());
        }

        this.selectShape = function (shape) {
            current = this.createToolShape(shape, current==null);
            this.renderView();
        }

        this.createToolShape = function (shape, isCancel) {
            const shapeType = shape.getAttribute('tool-shape');
            return {
                id: new Date().getTime().toString(36),
                shape: shapeType,
                info: parts.info(shapeType, isCancel),
            }
        }

        this.saveStorage = function(){
            localStorage['schematics'] = JSON.stringify({
                current,
                schematics,
            });
        }

        this.getStorage = function (){
            if(!localStorage['schematics']) this.saveStorage();
            let storage = JSON.parse(localStorage['schematics']);
            current = storage?.current;
            schematics = storage?.schematics;
        }

        this.renderView = function () {
            this.saveStorage();
            console.log(schematics)
            views.renderView(current, schematics);
        }

    }

    function View() {
        let parts;
        let app;
        let side;

        this.init = function (part) {
            parts = part;
            app = document.querySelector('#app');
            side = document.querySelector('aside.sidebar');
        }

        this.getParts = function () {
            return parts;
        }

        this.renderView = function (current, schematics) {
            const isSchema = schematics.hasOwnProperty(current?.id);
            this.renderSidebar(current, isSchema);
            this.renderWindow(schematics);
        }

        this.renderWindow = function (schematics){
            this.clearView(app);
            Object.keys(schematics).map(id=>{
                parts.module.shape.render(app, id, schematics[id]);
            })
        }

        this.renderSidebar = function (current, isSchema) {
            this.clearView(side);
            parts.module.sidebar.render(side, current, isSchema);
        }

        this.clearView = function (el) {
            el.innerHTML = '';
        }
    }
    return {
        init: function () {
            const parts = {
                info,
                module,
            };

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(parts);
            model.init(view);
            controller.init(model);
        }
    }
})();

/**
 * 
 * id, attr
 * 받아서 change
 * 
 */