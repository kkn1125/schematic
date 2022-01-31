const Schematic = (function (){
    function Controller(){
        let models;

        this.init = function(model){
            models = model;

            window.addEventListener('keyup', this.toolReplaceKeyDIV);
            window.addEventListener('dblclick', this.toolReplaceTA);
            window.addEventListener('click', this.toolReplaceClickDIV);
            window.addEventListener('click', this.toolSelect);
            window.addEventListener('click', this.createTool);
            window.addEventListener('keyup', this.handleInfoValue);
        }

        this.toolReplaceKeyDIV = function (ev){
            const target = ev.target;

            if(!target.hasAttribute('tool-replace') || !ev.key=='Enter' || !ev.ctrlKey) return;

            models.toolReplaceDIV(document.querySelectorAll('textarea[tool-replace]'));
        }

        this.toolReplaceClickDIV = function (ev){
            const target = ev.target;

            if(target.hasAttribute('tool-replace')) return;
            models.toolReplaceDIV(document.querySelectorAll('textarea[tool-replace]'));
        }

        this.toolReplaceTA = function (ev){
            const target = ev.target;
            if(!target.hasAttribute('tool-replace')) return;
            models.toolReplaceTA(target);
        }

        this.createTool = function (ev){
            const target = ev.target;
            if(!target.hasAttribute('tool-shape-apply')) return;

            models.createTool(target);
        }

        this.handleInfoValue = function (ev){
            const target = ev.target;
            if(!target.hasAttribute('tool-info-value'))return;
            
            models.handleInfoValue(ev,target);
        }

        this.toolSelect = function (ev) {
            const target = ev.target;

            if(!target.getAttribute('tool-shape')) return;

            models.toolSelect(target);
        }
    }

    function Model(){
        let views;
        let workflow = [];
        let schematic = {};
        let readyTool;
        let toolWindow;

        this.init = function(view){
            views = view;

            try{
                if(document.querySelector('[tool-window]')){
                    toolWindow = document.querySelector('[tool-window]');
                } else {
                    throw new Error('[Warn] No Target!');
                }
            } catch (e) {
                console.error(e.message);
            }

            this.renderSchematics();
        }

        this.getToolBox = function (shape, width='150px', height='150px', color='black', bgColor='white', borderColor='black', thickness='1px', lineType='solid'){
            return {
                shape: shape,
                width: width,
                height: height,
                color: color,
                bgColor: bgColor,
                'border-color': borderColor,
                thickness: thickness,
                'line-type': lineType,
                top: 0,
                left: 0,
            }
        }

        this.toolReplaceDIV = function (target){
            [...target].forEach(els=>{
                const el = document.createElement('div');
                    el.textContent = els.value;
                [...els.attributes].forEach(x=>{
                    el.setAttribute(x.name, x.value);
                })
                els.insertAdjacentElement('afterend', el);
                els.remove();
            })
        }

        this.toolReplaceTA = function (target){
            const el = document.createElement('textarea');
            el.value = target.textContent;

            el.addEventListener('keyup', ()=>{
                const id = Object.keys(schematic).pop();
                schematic[id].text = el.value;
            });

            [...target.attributes].forEach(x=>{
                el.setAttribute(x.name, x.value);
            })

            target.insertAdjacentElement('afterend', el);
            target.remove();
            el.focus();
        }

        this.toolSelect = function(tool){
            const toolBox = this.getToolBox(tool.getAttribute('tool-shape'));
            
            readyTool = toolBox;
            console.log(readyTool)

            this.renderSchematics();
        }

        this.addWork = function (){
            this.save(readyTool);
            this.addWorkFlow();
        }

        this.addWorkFlow = function (){
            let isDup = workflow.filter(x=>{
                const id = Object.keys(x).pop();
                const sid = Object.keys(schematic).pop();
                if(id == sid){
                    return true;
                }
                return false;
            })
            if(isDup.length==0) workflow.push(schematic);
        }

        this.save = function (work){
            schematic[new Date().getTime().toString(36)] = work;
        }

        this.createTool = function (target){
            this.addWork();
            readyTool = null;
            this.renderSchematics();
        }

        this.handleInfoValue = function (ev, input){
            let number = parseFloat(input.value.match(/[0-9]+/gm));
            number = parseFloat(input.value.split(number)[0] + number);
            let text = input.value.replace(number, '$');
            
            if(ev.key == 'ArrowUp'){
                number++;
                if(number<0){
                    number = 0;
                }
                text = text.replace(/\$/gm, number);
                input.value = text;
            } else if(ev.key == 'ArrowDown'){
                number--;
                if(number<0){
                    number = 0;
                }
                text = text.replace(/\$/gm, number);
                input.value = text;
            }

            Object.values(input.parentNode.attributes).forEach(({name, value})=>{
                if(name.match(/tool-info-/)){
                    readyTool[name.split('-').pop()] = input.value;
                }
            });
        }

        this.renderSchematics = function (){
            views.renderSchematics(schematic, readyTool);
        }
    }

    function View(){
        let parts;
        let toolWindow;

        this.init = function(part){
            parts = part;

            toolWindow = document.querySelector('[tool-window]');
        }

        this.renderSchematics = function (schematic, ready){
            this.clearSideBar();
            this.clearToolWindow();
            this.renderWindow(schematic);
            this.renderSideBar(ready);
        }

        this.renderWindow = function (schematic){
            Object.keys(schematic).forEach(key=>{
                parts.shape(toolWindow, schematic, key)
            })
        }

        this.renderSideBar = function (ready){
            const toolInfoType = document.querySelector('[tool-info-type]');

            const makeList = (toolInfoList)=>Object.keys(toolInfoList).map(key=>`
            <li class="list-item">
                <span
                tool-info-${key}
                class=" fs-7 text-muted">
                    ${key}
                    <input
                    tool-info-value
                    class="form-input w-50"
                    style="border: none"
                    type="text"
                    value="${toolInfoList[key]}">
                </span>
            </li>`).join('');

            if(!ready) {
                toolInfoType.innerHTML = `no select`;
                return;
            }

            toolInfoType.innerHTML = `${ready.shape} info`;
            toolInfoType.insertAdjacentHTML('afterend', `
            <ul
            tool-info-list
            class="list-group rounded-2 p-3">
                ${makeList(Object.filter(ready, (key)=>key!='shape'))}
                <li>
                <button
                tool-shape-apply
                class="btn btn-info">Apply</button>
                </li>
            </ul>`);
        }

        this.clearToolWindow = function (){
            document.querySelector('[tool-window]').innerHTML = '';
        }

        this.clearSideBar = function (){
            document.querySelector('[tool-info-list]')?.remove();
        }
    }

    return {
        init(){
            const parts = {
                shape: function (target, work, id){
                    console.log(work)
                    target.insertAdjacentHTML('beforeend',`
                        <div
                        work-id="${id}">
                            <div
                            style="
                            position: absolute;
                            ${work[id].shape=='circle'
                            ?'border-radius: 50%;'
                            :''}
                            width: ${work[id].width};
                            height: ${work[id].height};
                            border: ${work[id].thickness} ${work[id]['line-type']} ${work[id]['border-color']};
                            top: ${work[id].top};
                            left: ${work[id].left};
                            color: ${work[id].color};
                            background-color: ${work[id].bgColor};
                            ">
                            <div
                            tool-replace>${work[id].text??''}</div>
                            </div>
                        </div>
                    `);
                }
            }

            const view = new View();
            const model = new Model();
            const controller = new Controller();

            view.init(parts);
            model.init(view);
            controller.init(model);
        }
    }

})();

const schematic = Schematic.init();