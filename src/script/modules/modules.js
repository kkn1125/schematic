export default {
    gnb: {
        tabs: [{
                toolTab: 'file'
            },
            {
                toolTab: 'window'
            },
            {
                toolTab: 'about'
            },
        ],
        list: function () {
            return this.tabs.map(({
                toolTab
            }) => `<li class="pointer py-3 px-5 pointer" tool-tab="${toolTab}">${toolTab}</li>`).join('');
        },
        render: function (el) {
            el.insertAdjacentHTML('beforeend', `<div class="sch-row gap-5">
                <span class="brand p-3">
                    <a href="/">Schematic</a>
                </span>
                <ul class="sch-row sch-middle">
                    ${this.list()}
                </ul>
            </div>
            `);
        }
    },
    footer: {
        shapes: [
            'box',
            'circle'
        ],
        tabs: [
            'about'
        ],
        shapeList: function(){
            return this.shapes.map(s=>`<li class="py-3 px-5 pointer"><span tool-shape="${s}">${s}</span></li>`).join('');
        },
        list: function () {
            return this.tabs.map(tab => `<li class="py-3 px-5 pointer"><a href="#${tab}">${tab}</a></li>`).join('');
        },
        render: function (el) {
            el.insertAdjacentHTML('beforeend', `<div class="sch-col">
                <ul class="sch-row sch-all-center">
                    ${this.shapeList()}
                </ul>
                <div style="background-color: #4e4e4e; height: 2px;"></div>
                <ul class="sch-row sch-all-center">
                    ${this.list()}
                </ul>
            </div>
            `);
        }
    },
    tabList: {
        file: {
            save: function() {

            },
            import: function() {

            },
            export : function() {

            },
            close: function() {

            },
        },
        window: {
            'full screen': function() {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    /* IE11 */
                    elem.msRequestFullscreen();
                }
            },
            'window screen': function() {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then(data=>{
                        // console.log(data)
                    }).catch(e=>{
                        return;
                    })
                } else if (document.webkitExitFullscreen) {
                    /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    /* IE11 */
                    document.msExitFullscreen();
                }
            },
        },
        about: {
            developer: function() {

            },
        },
        useFeature: function (type, ev) {
            const target = ev.target;
            const feature = target.getAttribute('tab-feature');
            if (feature) {
                this[type][feature]();
            }
        },
        listify(type) {
            return Object.keys(this[type]).map(li => `<li onclick="(${this[type][li]})()" tab-feature="${li}" class="list-item pointer">${li}</li>`).join('');
        },
        render(el, info) {
            el.insertAdjacentHTML('beforeend', `
                <div
                style="
                    top: ${info.top}px;
                    left: ${info.left}px;
                "
                tab-list="${info.type}">
                    <ul class="list-group fs-2">
                        ${this.listify(info.type)}
                    </ul>
                </div>
            `);
        }
    },
    ground: {
        shape: function(list){
            return list.map(tool=>{
                let id = tool.id;
                let {top, left, align, bgColor, border, color, height, opacity, shape, width, contents} = tool.info;
                let {use, width:bWidth, type, color: bColor} = border;
                let temp = '';
                if(align == 'all'){
                    temp = 'display: flex; justify-content: center; align-items: center;'
                } else if(align == 'horizon'){
                    temp = 'display: flex; justify-content: center;'
                } else if(align == 'vertical'){
                    temp = 'display: flex; align-items: center;'
                }
                return `
                    <div
                    work-id="${id}"
                    shape="${shape}"
                    style="
                    position: absolute;
                    top: ${top};
                    left: ${left};
                    color: ${color};
                    background-color: ${bgColor};
                    width: ${width};
                    height: ${height};
                    opacity: ${opacity};
                    ${use?`border: ${bWidth} ${type} ${bColor};`:''}
                    ${temp}
                    "
                    >${contents.join('<br>')}</div>
                `;
            }).join('');
        },
        render(el, list) {
            el.insertAdjacentHTML('beforeend', `${this.shape(list)}`);
        }
    },
    info: {
        borders: function(border){
            if(border.use) return `
                ${border.width} ${border.type} ${border.color}
            `.trim();
            else '';
        },
        contents: function(info){
            if(info.contents.length==0){
                return `<input info="${'contents'}" type="text" value="${info['contents']}" disabled>`;
            }
            return info.contents.map((str,i)=>`<input info="${'contents'}" type="text" value="${str}" disabled>`).join('');
        },
        elInput: function (name, info){
            return `<input info="${name}" type="text" value="${name=='border'?this.borders(info['border']):name=='contents'?'':info[name]}" disabled>`
        },
        list: function(info){
            if(!info) return '';
            return Object.keys(info).map(name=>`<div tool-info>
                <span info-namespace>${name}</span>
                ${name=='contents'
                ?this.contents(info)
                :this.elInput(name, info)}
                ${name=='contents'?`<button add-contents>add contents</button>`:''}
            </div>`).join('');
        },
        render(el, info) {
            el.insertAdjacentHTML('beforeend', this.list(info)+`
            <button info-apply>apply</button>
            `);
        }
    }
}