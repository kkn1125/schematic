let zIndex = 0;
export const info = function (shapeType, isCancel) {
    if(isCancel){
        zIndex++;
    }
    return {
        width: '100px',
        height: '100px',
        padding: '.3rem',
        border: '1px solid black',
        color: 'black',
        bgColor: 'white',
        opacity: 1,
        borderRadius: shapeType=='circle'?'50%':'.5rem',
        top: '10%',
        left: '10%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: zIndex,
        contents: [],
    }
}

export const module = {
    shape: {
        render: function (el, id, schematic) {
            const {
                shape,
                info
            } = schematic;
            const {
                width,
                height,
                padding,
                border,
                color,
                bgColor,
                opacity,
                borderRadius,
                top,
                left,
                position,
                contents,
                display,
                alignItems,
                justifyContent,
                zIndex,
            } = info;
            el.insertAdjacentHTML('beforeend', `
                <div
                schematic-id="${id}"
                schematic-shape="${shape}"
                style="
                    transform: translate(${left}, ${top});
                    padding: ${padding};
                    min-width: ${width};
                    min-height: ${height};
                    border: ${border};
                    color: ${color};
                    background-color: ${bgColor};
                    opacity: ${opacity};
                    border-radius: ${borderRadius};
                    top: 0%;
                    left: 0%;
                    position: ${position};
                    display: ${display};
                    align-items: ${alignItems};
                    justify-content: ${justifyContent};
                    z-index: ${zIndex};
                ">${contents.join('<br>')}</div>
            `);
        }
    },
    topbar: {
        file: {
            save: function () {
                console.log('저장합니다!')
            },
            import: function () {
                console.log('가져옵니다!')
            },
            export: function () {
                console.log('내보냅니다!')
            },
            close: function () {
                console.log('종료합니다!')
                // window.close();
            },
        },
        window: {
            'full screen': function () {
                document.documentElement.requestFullscreen();
            },
            'window screen': function () {
                document.exitFullscreen().catch(e => {
                    // error
                });
            },
        },
        about: {
            developer: function () {
                console.log('개발자는')
            }
        },
        render: function (type, top, left) {
            return document.body.insertAdjacentHTML('beforeend',
                `<ul
            open-tool-tab="${type}"
            style="
                top: ${top}px;
                left: ${left}px;
            ">
            ${Object.keys(this[type])
            .map(li=>`<li
            onclick="(${this[type][li]})()"
            tab-list="${li}">${li}</li>`)
            .join('')}
            </ul>`
            );
        }
    },
    sidebar: {
        render: function (el, data, isSchema=false) {
            if (!data) {
                el.insertAdjacentHTML('beforeend', `No Seleced 🎈`);
                return;
            }
            const {
                id,
                shape,
                info
            } = data;
            const list = Object.keys(info).map(name => `<li>
                <span work-name>${name}</span>
                <span>
                    ${name!=='contents'
                ?`<input
                work-value="${name}"
                type="text"
                value="${info[name]}">`
                :info[name].length==0
                ?`<input
                work-value="${name}"
                type="text"
                value="${info[name]}"><button add-content>+</button>`
                :info[name].map((content, idx)=>{
                    return `<input
                    work-value="${name}"
                    type="text"
                    value="${content}">
                    ${info[name].length-1==idx?`<button add-content>+</button><button remove-content>remove empty</button>`:''}`
                }).join('')}
                </span>
            </li>`).join('');
            // ${name=='contents'?'<button add-content>+</button>':''}
            el.insertAdjacentHTML('beforeend', `
                <ul work-id="${id}">
                    <li>
                        <span class="h5">${shape}</span>
                    </li>
                    ${isSchema
                        ?`<li>
                        <button remove-schema>지우기</button>
                        </li>`
                        :''}
                    ${list}
                    <li>
                        <button tool-check>확인</button>
                    </li>
                </ul>
            `);
        }
    }
}