import Schematic from './schematic.js'

const schematic = Schematic.init({
    el: '#app',
    menu: [
        'file',
        'window',
        'about',
    ],
    initialValue: {
        top: '15px',
        left: '15px',
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
});